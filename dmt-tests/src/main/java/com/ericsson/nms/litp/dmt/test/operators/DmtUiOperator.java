/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2012
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package com.ericsson.nms.litp.dmt.test.operators;

import java.util.Map;

import javax.inject.Singleton;

import com.ericsson.cifwk.taf.UiOperator;
import com.ericsson.cifwk.taf.annotations.Context;
import com.ericsson.cifwk.taf.annotations.Operator;
import com.ericsson.cifwk.taf.data.*;
import com.ericsson.cifwk.taf.ui.*;
import com.ericsson.cifwk.taf.ui.core.UiComponent;
import com.ericsson.cifwk.taf.ui.sdk.Label;
import com.ericsson.nms.litp.dmt.test.pages.DmtViewModel;

@Operator(context = Context.UI)
@Singleton
// implements DmtOperator
public class DmtUiOperator implements UiOperator {
	private final Browser browser;
	private final BrowserTab browserTab;
	private final DmtViewModel dmtView;

	public DmtUiOperator() {
		final String url = getDmtUrl();
		this.browser = UI.newBrowser(BrowserType.FIREFOX);
		this.browserTab = browser.open(url);
		// this pause is necessary to ensure that browser is fully opened so
		// that the DmtViewModel is properly loaded
		UI.pause(4000);
		this.dmtView = browserTab.getView(DmtViewModel.class);

		// select first row in table
		this.selectTableRow();

		// select the Load into View Button
		this.loadSelectedRow();
	}

	public void closeBrowser() {
		browser.close();
	}

	private String getDmtUrl() {
		final Host dmtHost = DataHandler.getHostByName("dmt");
		final String uri = (String) DataHandler.getAttribute("dmt.web.uri");
		final Map<Ports, String> portMap = dmtHost.getPort();
		final String dmtPort = portMap.get(Ports.HTTP);
		if (dmtPort == null) {
			throw new IllegalArgumentException(
					"HTTP port not defined for host 'dmt'");
		}
		return String.format("http://%s:%s%s", dmtHost.getIp(), dmtPort, uri);
	}

	public String openTree(final String path, final String child) {
		UI.pause(2000);
		final String pathResult = path.substring(1, path.length() - 1);
		final String[] pathArray = pathResult.split("/");
		final String nodeToOpen = pathArray[pathArray.length - 1];
		searchTree(nodeToOpen, child);
		final String result = searchTree(child, child);

		return result;
	}

	public String searchTree(final String node, final String child) {
		for (int i = 0; i < dmtView.getNodeLabels().size(); i++) {
			if (dmtView.getNodeLabels().get(i).getText().equals(node)) {
				if (!dmtView.getNodes().equals(child)) {
					dmtView.getNodes().get(i).click();
					UI.pause(2000);
				} else {
					return child;
				}
			}
		}
		return node;
	}

	public String getRootText() {
		return dmtView.getRoot().getText();
	}

	public String selectNodeLabel(final String nodeLabel) {
		for (int i = 0; i < dmtView.getNodeLabels().size(); i++) {
			if (dmtView.getNodeLabels().get(i).getText().equals(nodeLabel)) {
				dmtView.getNodeLabels().get(i).click();
				return nodeLabel;
			}
		}
		return null;
	}

	public String getFirstPropertyValue() {
		UI.pause(1000);
		return dmtView.getFirstProperty().getText();
	}

	public String getRootPosition() {
		return dmtView.getRoot().getProperty("transform");
	}

	public void clickRepositionTreeButton() {
		dmtView.getRepositionTreeButton().click();
		UI.pause(1000);
	}

	public void clickPanLeft() {
		UI.pause(1000);
		dmtView.getPanLeftButton().click();
	}

	public void clickPanRight() {
		UI.pause(1000);
		dmtView.getPanRightButton().click();
	}

	public void enterPath(String path) {
		UI.pause(2000);
		dmtView.getNavigationBarInput().setText(path);
	}

	public String getPropertyHeaderName() {
		UI.pause(1000);
		return dmtView.getPropertyHeader().getText();
	}

	public String getNavigationResults() {
		UI.pause(1500);
		final String navigationResults = dmtView.getNavigationResultsPane()
				.getText();
		final String result = navigationResults.replaceAll("\n", "");
		return result;
	}

	private double findNodePosition(final UiComponent nodeCoordinates) {
		final String coordinateString = nodeCoordinates
				.getProperty("transform").split(",")[1];
		final double nodePosition = Double.parseDouble(coordinateString
				.substring(0, coordinateString.length() - 1));
		return nodePosition;
	}

	private double distanceBetweenNodes(final double nodeOnePosition,
			final double nodeTwoPosition) {
		double distance = 0;
		if (nodeOnePosition > 0) {
			distance = nodeTwoPosition - nodeOnePosition;
		} else {
			distance = nodeTwoPosition + Math.abs(nodeOnePosition);
		}
		return distance;
	}

	public Boolean confirmZoomIn() {
		final double initialNodeOnePosition = findNodePosition(dmtView
				.getNodeList().get(1));
		final double initialNodeTwoPosition = findNodePosition(dmtView
				.getNodeList().get(dmtView.getNodeList().size() - 1));
		final double initialDistance = distanceBetweenNodes(
				initialNodeOnePosition, initialNodeTwoPosition);
		clickZoomInButton();
		final double finalNodeOnePosition = findNodePosition(dmtView
				.getNodeList().get(1));
		final double finalNodeTwoPosition = findNodePosition(dmtView
				.getNodeList().get(dmtView.getNodeList().size() - 1));
		final double finalDistance = distanceBetweenNodes(finalNodeOnePosition,
				finalNodeTwoPosition);
		if (finalDistance > initialDistance) {
			return true;
		}
		return false;
	}

	public Boolean confirmZoomOut() {
		clickZoomInButton();
		UI.pause(1000);
		final double initialNodeOnePosition = findNodePosition(dmtView
				.getNodeList().get(1));
		final double initialNodeTwoPosition = findNodePosition(dmtView
				.getNodeList().get(dmtView.getNodeList().size() - 1));
		final double initialDistance = distanceBetweenNodes(
				initialNodeOnePosition, initialNodeTwoPosition);
		clickZoomOutButton();
		UI.pause(1000);
		final double finalNodeOnePosition = findNodePosition(dmtView
				.getNodeList().get(1));
		final double finalNodeTwoPosition = findNodePosition(dmtView
				.getNodeList().get(dmtView.getNodeList().size() - 1));
		final double finalDistance = distanceBetweenNodes(finalNodeOnePosition,
				finalNodeTwoPosition);
		if (finalDistance < initialDistance) {
			return true;
		}
		return false;
	}

	public void clickZoomOutButton() {
		dmtView.getZoomOutButton().click();
	}

	public void clickZoomInButton() {
		dmtView.getZoomInButton().click();
	}

	public Boolean confirmPanDirection(final String panDirection, final int x) {
		UI.pause(1000);
		if (panDirection.equals("left")) {
			return getRootXCoordinate() > x;
		} else if (panDirection.equals("right")) {
			return getRootXCoordinate() < x;
		}
		return false;
	}

	private Double getRootXCoordinate() {
		final String root = getRootPosition();
		final String panCoordinate = root.substring(10, root.length() - 1);
		final double xCoordinate = Double
				.parseDouble(panCoordinate.split(",")[0]);
		return xCoordinate;
	}

	/*
	 * Clicks the "edit" button to enter edit mode
	 */
	public void enableEditMode() {
		UI.pause(1000);
		dmtView.getEditButton().click();
	}

	/*
	 * Clicks the "Cancel Edit" button to exit edit mode
	 */
	public void disableEditMode() {
		dmtView.getCancelButton().click();
	}

	public Boolean isCancelButtonDisplayed() {
		return dmtView.getCancelButton().isDisplayed();
	}

	public Boolean isCommitButtonDisplayed() {
		return dmtView.getCommitButton().isDisplayed();
	}

	public Boolean propertyInputFieldIsDisplayed() {
		UI.pause(1000);
		return dmtView.getPropertyInputField().isDisplayed();
	}

	public void setPropertyFieldValue(String textInput) {
		UI.pause(1000);
		dmtView.getFirstProperty().click();
		dmtView.getPropertyInputField().setText(textInput);
	}

	public String getPropertyFieldValue() {
		return dmtView.getPropertyField().getText();
	}

	public Boolean navigationBarIsEnabled() {
		return (dmtView.getNavigationBarButton().isEnabled() && dmtView
				.getNavigationBarInput().isEnabled());
	}

	public void navigateTreeUsingNavigationBar(String inputPath) {
		enterPath(inputPath);
		UI.pause(6000);
		dmtView.getNavigationBarButton().click();
		UI.pause(6000);
	}

	public void clickPropertyInputKey() {
		dmtView.getPropertyInputKey().click();
	}

	public void clickCommitButton() {
		dmtView.getCommitButton().click();
	}

	public String litpErrorMessageIsDisplayed() {
		UI.pause(4000);
		return dmtView.getLitpErrorMessage().getText();
	}

	/*
	 * Get the error status in the edit property panel
	 */
	public Label getErrorStatus() {
		return dmtView.getErrorStatus();
	}

	public Boolean commitButtonIsEnabled() {
		return dmtView.getCommitButton().isEnabled();
	}

	public Boolean deleteNodeButtonIsEnabled() {
		return dmtView.getDeleteNodeButton().isEnabled();
	}

	public void clickDeleteNodeButton() {
		dmtView.getDeleteNodeButton().click();
	}

	public void clickConfirmDeleteNodeButton() {
		dmtView.getConfirmDeleteNodeButton().click();
	}

	public Boolean isAddNodeButtonEnabled() {
		return dmtView.getAddNodeButton().isEnabled();
	}

	public void clickAddNodeButton() {
		dmtView.getAddNodeButton().click();
	}

	public void clickFirstItemType() {
		UI.pause(1000);
		dmtView.getItemTypeList().click();
	}

	public Boolean isPropertyHeaderInputFieldDisplayed() {
		UI.pause(2000);
		return dmtView.getPropertyHeaderInputField().isDisplayed();
	}

	public void setPropertyHeaderFieldValue(String textInput) {
		UI.pause(1000);
		dmtView.getPropertyHeaderInputField().setText(textInput);
	}

	public Boolean isPropertyAddInputFieldDisplayed() {
		UI.pause(2000);
		return dmtView.getPropertyAddInputField().isDisplayed();
	}

	public void setPropertyAddInputFieldValue(String textInput) {
		UI.pause(1000);
		dmtView.getPropertyAddInputField().setText(textInput);
	}

	public Boolean isCommitAddNodeButtonEnabled() {
		return dmtView.getCommitAddNodeButton().isEnabled();
	}

	public void clickCommitAddNodeButton() {
		dmtView.getCommitAddNodeButton().click();
		UI.pause(2000);
	}

	public void selectTableRow() {
		dmtView.getTableLiveRow().click();
		UI.pause(2000);
	}

	public void loadSelectedRow() {
		dmtView.getLoadIntoViewButton().click();
		UI.pause(5000);
	}
}
