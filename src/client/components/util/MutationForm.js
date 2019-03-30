import React from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from 'client/components/form';
import ErrorMessage from 'client/components/form/ErrorMessage';

function getCleanApiError(error) {
	return (
		error && error.message && error.message.replace('GraphQL error: ', '')
	);
}

function MutationFormElement({
	children,
	afterMutation,
	queryLoading,
	queryError,
	queryData,
	disabled,
	mutation,
	...props
}) {
	return (
		<Mutation mutation={mutation}>
			{(mutate, { data, loading, error }) => {
				return (
					<Form
						values={queryData && queryData.values}
						disabled={disabled || queryLoading || loading}
						onSubmit={async data => {
							if (loading || queryLoading) {
								return;
							}

							let results = {};
							let mutationError = null;

							try {
								results = await mutate({
									variables: data,
								});
							} catch (error) {
								mutationError = error;
							}

							afterMutation &&
								afterMutation(
									mutationError,
									results.data,
									results,
								);
						}}
					>
						{queryError && (
							<ErrorMessage>
								{getCleanApiError(queryError)}
							</ErrorMessage>
						)}
						{error && (
							<ErrorMessage>
								{getCleanApiError(error)}
							</ErrorMessage>
						)}
						{children}
					</Form>
				);
			}}
		</Mutation>
	);
}

export default function MutationForm({ query, ...props }) {
	if (query) {
		return (
			<Query query={query}>
				{({ data, error, loading }) => {
					return (
						<MutationFormElement
							queryLoading={loading}
							queryError={error}
							queryData={data}
							{...props}
						/>
					);
				}}
			</Query>
		);
	}

	return <MutationFormElement {...props} />;
}
