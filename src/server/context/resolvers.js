function insertOne(model, options) {
	return async (_, doc, context) => {
		doc.createdAt = new Date();

		const _id = context.GenerateId();

		if (context.user) {
			doc.createdBy = context.user._id;
		}

		if (options && options.transformDoc) {
			doc = await options.transformDoc(_, { _id }, doc, context);
		}

		const response = await context[model].insertOne({
			_id,
			...doc,
		});

		if (options && options.afterInsert) {
			await options.afterInsert(_, response.ops[0], doc, context);
		}

		return response.ops[0];
	};
}

function updateOne(model, options) {
	return async (_, { _id, ...doc }, context) => {
		doc.updatedAt = new Date();

		if (context.user) {
			doc.updatedBy = context.user._id;
		}

		if (options && options.transformDoc) {
			doc = await options.transformDoc(_, { _id }, doc, context);
		}

		const response = await context[model].updateOne({ _id }, { $set: doc });

		if (!response.matchedCount) {
			throw new Error('Document not found');
		}

		return await context[model].findOne({ _id });
	};
}

function deleteOne(model) {
	return async (_, { _id }, context) => {
		const deleteReturn = await context[model].deleteOne({ _id });

		return deleteReturn.deletedCount === 1;
	};
}

function findOne(model) {
	return async (_, { _id }, context) => {
		return await context[model].findOne({ _id });
	};
}

function hasOne(model, { localKey }) {
	return async (parentNode, {}, context) => {
		return await context[model].findOne({ _id: parentNode[localKey] });
	};
}

function find(model) {
	return async (_, query, context) => {
		return await context[model].find(query).toArray();
	};
}

function paginate(model, options) {
	return async (
		parentNode,
		{ limit, skip, search, order, orderBy, ...args },
		context,
		info,
	) => {
		let query = {};
		let queryArgs = (options && options.queryArgs) || [];
		let selectionSetArray = [];

		info.fieldNodes[0].selectionSet.selections.map(selection =>
			selectionSetArray.push(selection.name.value),
		);

		if (search) {
			query['$search'] = {
				$search: search,
			};
		}

		queryArgs.forEach(key => {
			if (typeof args[key] == 'undefined') {
				return;
			}

			query[key] = args[key];
		});

		if (options && options.transformQuery) {
			query = await options.transformQuery(
				parentNode,
				args,
				query,
				context,
			);
		}

		let cursor = context[model]
			.find(query)
			.collation({ locale: 'nb', caseLevel: false });

		if (orderBy) {
			cursor.sort({ [orderBy]: order || -1 });
		}

		cursor.skip(skip || 0).limit(limit || 25);

		let count = null;
		let items = null;

		if (selectionSetArray.indexOf('count') > -1) {
			count = await context[model].find(query).count();
		}

		if (selectionSetArray.indexOf('items') > -1) {
			items = await cursor.toArray();
		}

		return {
			count,
			items,
		};
	};
}

function connection(model, options) {
	return async (
		parentNode,
		{ limit, skip, search, order, orderBy, ...args },
		context,
	) => {
		let query = {};
		let queryArgs = (options && options.queryArgs) || [];

		query[options.foreignKey] = parentNode[options.localKey || '_id'];

		if (search) {
			query['$search'] = {
				$search: search,
			};
		}

		queryArgs.forEach(key => {
			query[key] = args[key];
		});

		if (options.transformQuery) {
			query = await options.transformQuery(
				parentNode,
				args,
				query,
				context,
			);
		}

		let cursor = context[model].find(query);

		if (orderBy) {
			cursor.sort({ [orderBy]: order || -1 });
		}

		cursor.skip(skip || 0).limit(limit || 25);

		return {
			count: await context[model].find(query).count(),
			items: await cursor.toArray(),
		};
	};
}

export {
	insertOne,
	updateOne,
	deleteOne,
	findOne,
	find,
	hasOne,
	paginate,
	connection,
};
