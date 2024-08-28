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
package com.ericsson.nms.litp.dmt.test.pages;

import java.util.List;

import com.ericsson.cifwk.taf.ui.core.UiComponent;
import com.ericsson.cifwk.taf.ui.core.UiComponentMapping;
import com.ericsson.cifwk.taf.ui.sdk.*;

public class DmtViewModel extends GenericViewModel {

	// -------------------Labels---------------------//

	@UiComponentMapping(".eaDMT-wTree-node-root")
	private Label root;

	@UiComponentMapping(".eaDMT-wTree")
	private Label tree;

	@UiComponentMapping(".eaDMT-wPropertyHeader-nodeName")
	private Label propertyHeader;

	@UiComponentMapping(".eaDMT-wListItem>.eaDMT-wListItem-name")
	private Label propertiesHostName;

	@UiComponentMapping(".ebInfoPopup-content")
	private Label infoPopupContent;

	@UiComponentMapping(".eaDMT-wNavigation-resultsPane")
	private Label navigationResultsPane;

	@UiComponentMapping(".eaDMT-wPropertyHeader-editNode")
	private Label editButton;

	@UiComponentMapping(".eaDMT-wListItem-errorLitpMessage")
	private Label litpErrorMessage;

	@UiComponentMapping(".ebInput-statusError")
	private Label errorStatus;

	// -------------------TextBoxes-------------------//

	@UiComponentMapping(".eaDMT-wNavigation-input")
	private TextBox navigationBarInput;

	@UiComponentMapping(".eaDMT-wListItem-input")
	private TextBox propertyInputField;

	@UiComponentMapping(".eaDMT-wPropertyHeader-input.ebInput")
	private TextBox propertyHeaderInputField;

	@UiComponentMapping(".eaDMT-wListItem-input.ebInput.ebInput_width_long")
	private TextBox propertyAddInputField;

	// -------------------Buttons---------------------//

	@UiComponentMapping(".eaDMT-wNavigation-button")
	private Button navigationBarButton;

	@UiComponentMapping(".ebIcon_info")
	private Button infoButton;

	@UiComponentMapping(".ebBtn_color_darkBlue")
	private Button infoPopupCloseButton;

	@UiComponentMapping(".eaDMT-wPanLeft-button")
	private Button panLeftButton;

	@UiComponentMapping(".eaDMT-wPanRight-button")
	private Button panRightButton;

	@UiComponentMapping(".eaDMT-wRepositionTree-button")
	private Button repositionTreeButton;

	@UiComponentMapping(".eaDMT-wZoomControl-zoomIn-button")
	private Button zoomInButton;

	@UiComponentMapping(".eaDMT-wZoomControl-zoomOut-button")
	private Button zoomOutButton;

	@UiComponentMapping(".eaDMT-rProperties-cancelEdit-button")
	private Button cancelButton;

	@UiComponentMapping(".eaDMT-rProperties-commit-button")
	private Button commitButton;

	@UiComponentMapping(".eaDMT-wDeleteNode>.ebBtn")
	private Button deleteNodeButton;

	@UiComponentMapping(".ebBtn.eb_wMargin.ebBtn_color_darkBlue")
	private Button confirmDeleteNodeButton;

	@UiComponentMapping(".ebSelect-header")
	private Button addNodeButton;

	@UiComponentMapping(".eaDMT-rProperties-wProperties-commit-button.ebBtn.ebBtn_color_darkBlue.eaDMT-rProperties-wProperties-commit-button_visible")
	private Button commitAddNodeButton;

	// ------------------UiComponents------------------//

	@UiComponentMapping(".eaDMT-wTree-node-textLabel")
	private List<UiComponent> nodeLabels;

	@UiComponentMapping(".eaDMT-wTree-node-gCircle")
	private List<UiComponent> nodes;

	@UiComponentMapping(".eaDMT-wTree-node")
	private List<UiComponent> nodeList;

	@UiComponentMapping(".eaDMT-wListItem-value")
	private UiComponent propertyField;

	@UiComponentMapping(".eaDMT-wListItem-name")
	private UiComponent propertyInputKey;

	@UiComponentMapping(".ebComponentList-item")
	private UiComponent itemTypeList;

	@UiComponentMapping(".ebTableRow")
	private UiComponent tableLiveRow;

	@UiComponentMapping(".eaDMTDeployments-rTable-loadButton>.ebBtn")
	private UiComponent loadIntoViewButton;

	public DmtViewModel() {

	}

	public Button getZoomInButton() {
		return zoomInButton;
	}

	public Button getZoomOutButton() {
		return zoomOutButton;
	}

	public List<UiComponent> getNodeList() {
		return nodeList;
	}

	public Label getPropertyHeader() {
		return propertyHeader;
	}

	public Label getNavigationResultsPane() {
		return navigationResultsPane;
	}

	public List<UiComponent> getNodeLabels() {
		return nodeLabels;
	}

	public Label getRoot() {
		return root;
	}

	public Button getRepositionTreeButton() {
		return repositionTreeButton;
	}

	public Button getPanLeftButton() {
		return panLeftButton;
	}

	public Button getPanRightButton() {
		return panRightButton;
	}

	public Label getEditButton() {
		return editButton;
	}

	public Button getCancelButton() {
		return cancelButton;
	}

	public UiComponent getCommitButton() {
		return commitButton;
	}

	public UiComponent getFirstProperty() {
		return propertyField;
	}

	public TextBox getPropertyInputField() {
		return propertyInputField;
	}

	public TextBox getPropertyField() {
		return propertyInputField;
	}

	public TextBox getNavigationBarInput() {
		return navigationBarInput;
	}

	public Button getNavigationBarButton() {
		return navigationBarButton;
	}

	public UiComponent getPropertyInputKey() {
		return propertyInputKey;
	}

	public Label getLitpErrorMessage() {
		return litpErrorMessage;
	}

	public Label getErrorStatus() {
		return errorStatus;
	}

	public List<UiComponent> getNodes() {
		return nodes;
	}

	public Button getDeleteNodeButton() {
		return deleteNodeButton;
	}

	public Button getConfirmDeleteNodeButton() {
		return confirmDeleteNodeButton;
	}

	public Button getAddNodeButton() {
		return addNodeButton;
	}

	public UiComponent getItemTypeList() {
		return itemTypeList;
	}

	public TextBox getPropertyHeaderInputField() {
		return propertyHeaderInputField;
	}

	public TextBox getPropertyAddInputField() {
		return propertyAddInputField;
	}

	public Button getCommitAddNodeButton() {
		return commitAddNodeButton;
	}

	public UiComponent getTableLiveRow() {
		return tableLiveRow;
	}

	public UiComponent getLoadIntoViewButton() {
		return loadIntoViewButton;
	}

}