package com.ericsson.nms.litp.dmt.test.cases;

import javax.inject.Inject;

import org.junit.Before;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.ericsson.cifwk.taf.TestCase;
import com.ericsson.cifwk.taf.TorTestCaseHelper;
import com.ericsson.cifwk.taf.annotations.*;
import com.ericsson.cifwk.taf.guice.OperatorRegistry;
import com.ericsson.nms.litp.dmt.test.operators.DmtUiOperator;

// For testware check purposes
public class DmtUiTest extends TorTestCaseHelper implements TestCase {

	@Inject
	private OperatorRegistry<DmtUiOperator> dmtUIProvider;
	private DmtUiOperator dmtOperator;

	@Before
	public void setUp() throws Exception {
		// dmtOperator = new DmtUiOperator();
	}

	@TestId(id = "verifyModelExists_UI_test", title = "Verifies if the model exist")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyModelExists() {
		dmtOperator = new DmtUiOperator();
		final String result = dmtOperator.getRootText();
		Assert.assertEquals("/", result);
	}

	@TestId(id = "verifyNavigationBarFunctionality", title = "Verifies that the user can navigate the tree using the navigation bar")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyNavigationBarFunctionality() {
		/*
		 * The user can select the navigation bar and enter a path The node's
		 * label will be selected The node's properties will be displayed in the
		 * properties panel
		 */
		dmtOperator = new DmtUiOperator();
		String expectedPropertyHeader = "ms";
		String path = "/" + expectedPropertyHeader + "/";
		dmtOperator.navigateTreeUsingNavigationBar(path);
		String actualPropertyHeader = dmtOperator.getPropertyHeaderName();
		assertEquals(expectedPropertyHeader, actualPropertyHeader);
	}

	@TestId(id = "verifyZoomingIntoTree_UI_test", title = "Verifies that the zoom in capability works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyZoomingIn() {
		dmtOperator = new DmtUiOperator();
		assertTrue(dmtOperator.confirmZoomIn());
	}

	@TestId(id = "verifyZoomingOutOfTree_UI_test", title = "Verifies that the zoom out capability works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyZoomingOut() {
		dmtOperator = new DmtUiOperator();
		assertTrue(dmtOperator.confirmZoomOut());
	}

	@TestId(id = "verifyPanningWorks_UI_test", title = "Verifies that PAN functionality works.")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyPanningWorks() {
		dmtOperator = new DmtUiOperator();

		dmtOperator.clickPanLeft();
		dmtOperator.clickPanLeft();
		dmtOperator.clickPanLeft();
		Boolean panLeftPosition = dmtOperator.confirmPanDirection("left", 75);
		assertTrue(panLeftPosition);

		dmtOperator.clickPanRight();
		dmtOperator.clickPanRight();
		Boolean panRightPosition = dmtOperator
				.confirmPanDirection("right", 300);

		assertTrue(panRightPosition);
	}

	@TestId(id = "verifyRepositionTreeWorks_UI_test", title = "Verifies that the repostion tree button works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyRepositionTreeWorks() {
		dmtOperator = new DmtUiOperator();
		dmtOperator.clickPanLeft();
		final Boolean panLeftPosition = dmtOperator.confirmPanDirection("left",
				40);
		dmtOperator.clickRepositionTreeButton();
		String resetPosition = dmtOperator.getRootPosition();
		assertTrue(panLeftPosition);
		assertEquals("translate(39,300)", resetPosition);

	}

	@TestId(id = "verifyFirstPropertyText_UI_test", title = "Verifies the first property's text is correct.")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyFirstPropertyText() {
		dmtOperator = new DmtUiOperator();
		dmtOperator.selectNodeLabel("ms");

		String firstPropertyValue = dmtOperator.getFirstPropertyValue();
		assertEquals("ms1", firstPropertyValue);

	}

	@TestId(id = "verifyPathOpensAsExpected", title = "Verify path opens")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	@DataDriven(name = "tree_path")
	public void verifyPathOpensAsExpected(
			@Input("initialPath") final String initialPath,
			@Output("expectedChildren") final String expected) {
		dmtOperator = new DmtUiOperator();
		final String result = dmtOperator.openTree(initialPath, expected);
		assertEquals(expected, result);
	}

	@TestId(id = "verifyNavigationBarAutoSuggest", title = "Verify user can navigate to a specific node using the navigation bar auto suggest")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	@DataDriven(name = "navigation_autosuggest")
	public void verifyNavigationBarAutoSuggest(
			@Input("inputText") final String inputText,
			@Output("expectedChildren") final String expectedChildren) {
		dmtOperator = new DmtUiOperator();
		dmtOperator.enterPath(inputText);
		final String result = dmtOperator.getNavigationResults();
		assertEquals(expectedChildren, result);
	}

	@TestId(id = "verifyEditMode", title = "Verify user can access edit property mode")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyEditPropertyMode() {
		/*
		 * 1. The cancel “cancel edit ” button must be displayed 2. The “Commit
		 * Changes” button must be displayed 3. The property input field value
		 * must be editable 4. The “navigation bar” must be disabled 5. The
		 * “tree” must be disabled
		 */
		dmtOperator = new DmtUiOperator();
		String testPropertyInput = "testInput";
		dmtOperator.selectNodeLabel("ms");
		dmtOperator.enableEditMode();
		// enters text into the property input field
		dmtOperator.setPropertyFieldValue(testPropertyInput);
		// try to click on another node label
		dmtOperator.selectNodeLabel("software");

		// compares the actual value in the property input field to the expected
		// changed value
		assertEquals(testPropertyInput, dmtOperator.getPropertyFieldValue());
		// checks to see if the navigation bar is disabled
		assertFalse((dmtOperator.navigationBarIsEnabled()));
		/*
		 * checks that the property head name has not changed thus proving that
		 * the node label was NOT able to be clicked which proves that the tree
		 * is disabled in edit mode
		 */

		assertEquals("ms", dmtOperator.getPropertyHeaderName());
		// tests that cancel button is displayed
		assertTrue(dmtOperator.isCancelButtonDisplayed());
		// tests that commit button is displayed
		assertTrue(dmtOperator.isCommitButtonDisplayed());
	}

	@TestId(id = "verifyCancelEditMode", title = "Verify user can cancel edit mode")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyCancelEditMode() {
		String testPropertyInput = "testInput";
		dmtOperator = new DmtUiOperator();
		dmtOperator.selectNodeLabel("ms");
		dmtOperator.enableEditMode();
		String originalPropertyValue = dmtOperator.getPropertyFieldValue();
		dmtOperator.setPropertyFieldValue(testPropertyInput);
		dmtOperator.disableEditMode();
		dmtOperator.selectNodeLabel("software");

		// tests that any changes made to the property value is reset
		assertEquals(originalPropertyValue, dmtOperator.getPropertyFieldValue());
		// tests that property input field is no longer displayed
		assertFalse(dmtOperator.propertyInputFieldIsDisplayed());
		// navigation bar is enabled
		assertTrue(dmtOperator.navigationBarIsEnabled());
		/*
		 * checks that the property head name has changed thus proving that the
		 * node label was able to be clicked which proves that the tree is
		 * disabled in edit mode
		 */
		assertEquals("software", dmtOperator.getPropertyHeaderName());
		// tests for cancel button NOT being displayed
		assertFalse(dmtOperator.isCancelButtonDisplayed());
		// tests for commit button NOT being displayed
		assertFalse(dmtOperator.isCommitButtonDisplayed());
	}

	@TestId(id = "verifyServerSideErrorHandling", title = "Verify that server side error message is displayed beside the invalid property value input")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyServerSideErrorHandling() {
		String testNodeLabelPath = "/ms/ipaddresses/ip1/";
		String invalidPropertyFieldInputValue = "10.10.1.aaa";
		dmtOperator = new DmtUiOperator();
		// enter this path just to overcome the lag in navigating the tree. This
		// is a minor bug in the DMT
		dmtOperator.enterPath("/ms/");
		dmtOperator.navigateTreeUsingNavigationBar(testNodeLabelPath);
		dmtOperator.enableEditMode();
		String originalPropertyValue = dmtOperator.getPropertyFieldValue();
		dmtOperator.setPropertyFieldValue(invalidPropertyFieldInputValue);
		dmtOperator.clickPropertyInputKey();
		dmtOperator.clickCommitButton();

		assertEquals(dmtOperator.litpErrorMessageIsDisplayed(),
				"Invalid IPAddress value " + "'"
						+ invalidPropertyFieldInputValue + "'");

		dmtOperator.disableEditMode();
		// show that the error property was not committed
		assertEquals(originalPropertyValue, dmtOperator.getPropertyFieldValue());
	}

	@TestId(id = "verifyCanUpdateALitpProperty", title = "Verify user can update a litp property")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyCommitChanges() {
		dmtOperator = new DmtUiOperator();
		dmtOperator.selectNodeLabel("ms");
		String testPropertyInput = "testInputTwo";
		dmtOperator.enableEditMode();
		String originalPropertyValue = dmtOperator.getPropertyFieldValue();
		// enters text into the property input field
		dmtOperator.setPropertyFieldValue(testPropertyInput);
		dmtOperator.clickPropertyInputKey();
		dmtOperator.clickCommitButton();

		// checks that the property value has been successfully updated
		assertEquals(testPropertyInput, dmtOperator.getPropertyFieldValue());

		// Reset any changes made to LITP model
		dmtOperator.enableEditMode();
		dmtOperator.setPropertyFieldValue(originalPropertyValue);
		dmtOperator.clickPropertyInputKey();
		dmtOperator.clickCommitButton();

		// checks that the property value has been successfully reset
		assertEquals(originalPropertyValue, dmtOperator.getPropertyFieldValue());

	}

	@TestId(id = "verifyEditModeClientSideErrorHandling", title = "Verify edit mode client side error handling for case of invalid property")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyCannotCommitChanges() {
		dmtOperator = new DmtUiOperator();
		dmtOperator.selectNodeLabel("ms");
		dmtOperator.enableEditMode();
		final String originalPropertyValue = dmtOperator
				.getPropertyFieldValue();
		dmtOperator.setPropertyFieldValue("ms test");

		assertEquals("ms test", dmtOperator.getPropertyFieldValue());
		assertTrue(dmtOperator.getErrorStatus().isDisplayed());
		assertFalse(dmtOperator.commitButtonIsEnabled());

		// Reset the value
		dmtOperator.disableEditMode();
		assertEquals(originalPropertyValue, dmtOperator.getPropertyFieldValue());
	}

	@TestId(id = "verifyCanAddAndDeleteNode", title = "Verify the user can add a node and then select a node and delete it")
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyCanAddAndDeleteNode() {
		String testNodeLabelPath = "/infrastructure/storage/storage_profiles/";

		dmtOperator = new DmtUiOperator();

		// assert that the buttons are there and disabled
		assertFalse(dmtOperator.deleteNodeButtonIsEnabled());
		assertFalse(dmtOperator.isAddNodeButtonEnabled());

		// dmtOperator.enterPath("/infrastructure");
		dmtOperator.navigateTreeUsingNavigationBar(testNodeLabelPath);

		// assert that they are enabled now
		assertTrue(dmtOperator.deleteNodeButtonIsEnabled());
		assertTrue(dmtOperator.isAddNodeButtonEnabled());

		dmtOperator.clickAddNodeButton();
		dmtOperator.clickFirstItemType();

		assertTrue(dmtOperator.isPropertyHeaderInputFieldDisplayed());
		dmtOperator.setPropertyHeaderFieldValue("TestNode");

		assertTrue(dmtOperator.isPropertyAddInputFieldDisplayed());
		dmtOperator.setPropertyAddInputFieldValue("TestNode");

		// the purpose of this click is to enable the commit button
		dmtOperator.clickPropertyInputKey();
		assertTrue(dmtOperator.isCommitAddNodeButtonEnabled());

		dmtOperator.clickCommitAddNodeButton();

		// delete TestNode
		assertTrue(dmtOperator.deleteNodeButtonIsEnabled());

		dmtOperator.clickDeleteNodeButton();
		dmtOperator.clickConfirmDeleteNodeButton();

		assertEquals("profiles", dmtOperator.getPropertyHeaderName());

	}

	private DmtUiOperator getUIOperator() {
		return dmtUIProvider.provide(DmtUiOperator.class);
	}

}