import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import ScrollPane from 'client/components/ScrollPane';
import { AppContext } from 'client/libs/app';

const sidebarWidth = 280;

const Wrapper = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
`;

const ContentWrapper = styled(ScrollPane)`
	position: absolute;
	top: 56px;
	right: 0;
	bottom: 0;
	left: 0;
	background: ${({ theme }) => theme.background};
	${({ theme }) => theme.breakpoints.up('sm')} {
		top: 64px;
	}
	${({ theme }) => theme.breakpoints.up('md')} {
		left: ${sidebarWidth}px;
	}
`;

const AppBarWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	${({ theme }) => theme.breakpoints.up('md')} {
		left: ${sidebarWidth}px;
	}
`;

const StyledAppBar = styled(AppBar)`
	background: white;
	border-bottom: ${({ theme }) => theme.border};
	box-shadow: none;
`;

const SidebarContentWrapper = styled.div`
	width: ${sidebarWidth}px;
`;

const SidebarTopBar = styled.div`
	width: 100%;
	height: 56px;
	border-bottom: ${({ theme }) => theme.border};
	${({ theme }) => theme.breakpoints.up('sm')} {
		height: 64px;
	}
`;

const SidebarContent = () => (
	<SidebarContentWrapper>
		<SidebarTopBar />
		<h1>Sidebar content</h1>
	</SidebarContentWrapper>
);

export default function DashboardLayout({ title, children, sidebarOverride }) {
	let [isSidebarOpen, setIsSidebarOpen] = useState(false);
	let { isMobile, appName } = useContext(AppContext);

	let showSidebar = true;

	if (isMobile) {
		showSidebar = isSidebarOpen;
	}

	return (
		<Wrapper>
			<AppBarWrapper>
				<StyledAppBar position="static" color="default">
					<Toolbar>
						<Hidden mdUp implementation="css">
							<IconButton
								color="inherit"
								aria-label="Menu"
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							>
								<MenuIcon />
							</IconButton>
						</Hidden>
						<Typography variant="h6" color="inherit">
							{title}
						</Typography>
					</Toolbar>
				</StyledAppBar>
			</AppBarWrapper>

			<Hidden smDown implementation="css">
				<Drawer variant="permanent">
					<SidebarContent />
				</Drawer>
			</Hidden>

			<Hidden smdUp implementation="css">
				<SwipeableDrawer
					variant="temporary"
					open={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					<SidebarContent />
				</SwipeableDrawer>
			</Hidden>

			<ContentWrapper isSidebarOpen={isSidebarOpen}>
				{children}
			</ContentWrapper>
		</Wrapper>
	);
}
