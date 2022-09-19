define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'CampaignUtility'], function (FormControllerUtility, CommonUtilities, ViewConstants, CampaignUtility) {
    return {
        /**
         * Method to load Feedback Module
         */
        loadFeedbackModule: function () { //TODO: will be replaced with Commom Utitlty method if any.
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("FeedbackModule");
        },
        shouldUpdateUI: function (viewModel) {
            return viewModel !== undefined && viewModel !== null;
        },
        updateFormUI: function (feedbackViewModel) {
            if (feedbackViewModel.showProgressBar) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (feedbackViewModel.hideProgressBar) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (feedbackViewModel.onServerDownError) {
                this.showServerDownForm(feedbackViewModel.onServerDownError);
            }
            if (feedbackViewModel.submitFeedbackSuccess) {
                this.submitFeedbackSuccessFlow();
            }
            if (feedbackViewModel.showServerError) {
                this.showServerError(feedbackViewModel.showServerError);
            }
            if (feedbackViewModel.preLoginView) {
                this.showPreLoginView();
            }
            if (feedbackViewModel.postLoginView) {
                this.showPostLoginView();
            }
            if (feedbackViewModel.campaign) {
                CampaignUtility.showCampaign(feedbackViewModel.campaign, this.view, "flxMainContainer");
            }
            this.AdjustScreen();
        },
        /**
         * Method to handle Server errors. Will navigate to serverdown page.
         * @member frmCustomerFeedbackController
         * @param {object} onServerDownError
         * @returns {void} - None
         * @throws {void} - None
         */
        showServerDownForm: function (onServerDownError) {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
            authModule.presentationController.navigateToServerDownScreen();
        },
        showServerError: function (errMessage) {
            this.view.flxDowntimeWarning.isVisible = true;
            this.view.lblDowntimeWarning.text = errMessage;
            this.AdjustScreen();
            this.view.imgCloseDowntimeWarning.setFocus();
        },
        /**
         * Show Feedback Pre-Login View UI
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        showPreLoginView: function () {
            this.view.flxHeaderPreLogin.setVisibility(true);
            this.view.flxHeaderPostLogin.setVisibility(false);
            this.view.flxFormContent.top = "70dp";
            if (kony.application.getCurrentBreakpoint() === 640) {
                this.view.flxHeaderPreLogin.setVisibility(false);
                this.view.flxHeaderPostLogin.setVisibility(true);
            }
            this.view.imgKony.setFocus(true);
            this.view.customheader.topmenu.flxMenu.isVisible = false;
            this.view.imgLogout.toolTip = kony.i18n.getLocalizedString("i18n.common.login");
            this.view.imgLogout.onTouchStart = function () {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
                authModule.presentationController.showLoginScreen();
            };
            this.view.imgKony.onTouchEnd = function () {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
                authModule.presentationController.showLoginScreen();
            };
            this.view.forceLayout();
        },
        /**
         * Show Feedback Post-Login View UI
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        showPostLoginView: function () {
            if (kony.application.getCurrentBreakpoint() === 640) {
                this.view.flxFormContent.top = "50dp";
            } else {
                this.view.flxFormContent.top = "120dp";
            }
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Feedback");
            this.view.flxHeaderPreLogin.setVisibility(false);
            this.view.flxHeaderPostLogin.setVisibility(true);
            this.view.customheader.imgKony.setFocus(true);
            this.view.customheader.customhamburger.activateMenu("About Us", "Feedback");
            this.view.customheader.topmenu.flxMenu.isVisible = true;
        },
        /**
         * Post show for customer feedback
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        postShowCustomerFeedback: function () {
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.flxDowntimeWarning.isVisible = false;
            this.AdjustScreen();
            this.disableButton(this.view.Feedback.confirmButtons.btnConfirm);
        },
        /**
         * Funtion to adjust screen
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        AdjustScreen: function () {
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheader.info.frame.height + this.view.flxMainContainer.info.frame.height;
            if (this.view.customheader.info.frame.height == 0) {
                mainheight += 120;
            }
            if (this.view.flxDowntimeWarning.isVisible) {
                mainheight += 60;
            }
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0)
                    this.view.flxFooter.top = mainheight + diff + "dp";
                else
                    this.view.flxFooter.top = mainheight + "dp";
            } else {
                this.view.flxFooter.top = mainheight + "dp";
            }
            this.view.forceLayout();
        },
        /**
         * Pre show of Customer Feedback
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        preShowCustomerFeedback: function () {
            var scopeObj = this;
            this.feedbackRating = 0;
            var feedback = this.view.Feedback;
            this.view.customheader.forceCloseHamburger();
            this.view.onBreakpointChange = function () {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            };
            this.view.flxFeedbackAcknowledgement.setVisibility(false);
            this.view.flxAcknowledgementContainer.setVisibility(false);
            this.view.flxFeedbackContainer.setVisibility(true);
            this.view.flxFeedback.setVisibility(true);
            this.view.Feedback.imgRating1.skin = "sknLblFontTypeIcona0a0a020px";
            this.view.Feedback.imgRating1.text = "k";
            this.view.Feedback.imgRating2.skin = "sknLblFontTypeIcona0a0a020px";
            this.view.Feedback.imgRating2.text = "k";
            this.view.Feedback.imgRating3.skin = "sknLblFontTypeIcona0a0a020px";
            this.view.Feedback.imgRating3.text = "k";
            this.view.Feedback.imgRating4.skin = "sknLblFontTypeIcona0a0a020px";
            this.view.Feedback.imgRating4.text = "k";
            this.view.Feedback.imgRating5.skin = "sknLblFontTypeIcona0a0a020px";
            this.view.Feedback.imgRating5.text = "k";
            this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU_HOVER;
            this.view.customheader.topmenu.lblFeedback.skin = ViewConstants.SKINS.FEEDBACK_LABELFEEDBACK;
            feedback.flxAddFeatureRequest.setVisibility(true);
            feedback.flxUserFeedback.setVisibility(false);
            feedback.txtareaUserComments.onKeyUp = this.updateCharCountComments.bind(this);
            feedback.txtareaUserAdditionalComments.onKeyUp = this.updateCharCountFeedback.bind(this);
            feedback.txtareaUserComments.text = "";
            feedback.txtareaUserAdditionalComments.text = "";
            feedback.txtareaUserComments.onKeyUp();
            feedback.txtareaUserAdditionalComments.onKeyUp();
            this.view.CopylblSurvey0cb6dc11415f44a.text = kony.i18n.getLocalizedString("i18n.CustomerFeedback.Feedback");
            this.view.Feedback.LblAddFeatureRequest.text = kony.i18n.getLocalizedString("i18n.CustomerFeedback.AddFeatureRequest");
            this.view.CustomFooterMain.lblCopyright.text = kony.i18n.getLocalizedString("i18n.footer.copyright");
            this.view.Feedback.confirmButtons.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            this.view.Feedback.confirmButtons.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.CustomerFeedback.Submit");
            this.view.forceLayout();
            this.showActions();
            CampaignUtility.fetchPopupCampaigns();
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['customheader', 'flxMainContainer', 'flxHeaderPreLogin', 'flxHeaderPostLogin', 'flxFooter', 'flxHeader', 'flxFormContent']);
        },
        updateCharCountComments: function () {
            this.view.Feedback.lblCharCountComments.text = this.view.Feedback.txtareaUserComments.text.length + "/1000";
            this.view.Feedback.forceLayout(); // temp fix, need to remove
        },
        updateCharCountFeedback: function () {
            this.view.Feedback.lblCharCountFeedback.text = this.view.Feedback.txtareaUserAdditionalComments.text.length + "/1000";
        },
        /**
         * Register actions for Customer Feedback
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        showActions: function () {
            var scopeObj = this;
            this.view.Feedback.flxImgInfoIcon.onClick = function () {
                if (scopeObj.view.Feedback.AllForms.isVisible === false) {
                    scopeObj.view.Feedback.AllForms.isVisible = true;
                    if (kony.application.getCurrentBreakpoint() === 1366) {
                        scopeObj.view.Feedback.AllForms.left = "100dp";
                    } else if (kony.application.getCurrentBreakpoint() === 1024) {
                        scopeObj.view.Feedback.AllForms.left = "70dp";
                    } else if (kony.application.getCurrentBreakpoint() === 640) {
                        scopeObj.view.Feedback.AllForms.left = "70dp";
                    }
                } else scopeObj.view.Feedback.AllForms.isVisible = false;
            };
            this.view.Feedback.AllForms.flxCross.onClick = function () {
                scopeObj.view.Feedback.AllForms.isVisible = false;
            };
            this.view.Feedback.flxRating1.onClick = function () {
                scopeObj.showRatingAction(1);
            };
            this.view.Feedback.flxRating2.onClick = function () {
                scopeObj.showRatingAction(2);
            };
            this.view.Feedback.flxRating3.onClick = function () {
                scopeObj.showRatingAction(3);
            };
            this.view.Feedback.flxRating4.onClick = function () {
                scopeObj.showRatingAction(4);
            };
            this.view.Feedback.flxRating5.onClick = function () {
                scopeObj.showRatingAction(5);
            };
            this.view.Feedback.confirmButtons.btnModify.onClick = function () {
                scopeObj.view.flxDowntimeWarning.isVisible = false;
                scopeObj.addCancelAction();
                scopeObj.AdjustScreen();
            };
            this.view.imgCloseDowntimeWarning.onTouchEnd = function () {
                this.view.flxDowntimeWarning.isVisible = false;
                this.AdjustScreen();
            }.bind(this);
            if (CommonUtilities.isCSRMode()) {
                this.view.Feedback.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
            } else {
                this.view.Feedback.confirmButtons.btnConfirm.onClick = function () {
                    scopeObj.addSubmitAction();
                };
            }
            this.view.Feedback.flxAddFeatureRequestandimg.onClick = function () {
                scopeObj.addFeatureRequestAction();
                scopeObj.AdjustScreen();
            };
            this.view.btnAddAnotherAccount.onClick = function () {
                var surveyModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SurveyModule");
                surveyModule.presentationController.surveyDone();
            };
            this.view.btnDone.onClick = function () {
                scopeObj.showAccountModule();
            };
            this.view.acknowledgment.flxTakeSurvey.onClick = function () {
                scopeObj.loadFeedbackModule().presentationController.showSurveyForm();
            };
            this.view.btnLogin.onClick = function () {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
                authModule.presentationController.showLoginScreen();
            };
        },
        /**
         * Toggle checkbox
         * @member frmCustomerFeedbackController
         * @param {String} imgCheckBox
         * @returns {void} - None
         * @throws {void} - None
         */
        toggleCheckBox: function (imgCheckBox) {
            CommonUtilities.toggleCheckbox(imgCheckBox);
        },
        /**
         * Show Ratings
         * @member frmCustomerFeedbackController
         * @param {Int} val
         * @returns {void} - None
         * @throws {void} - None
         */
        showRatingAction: function (val) {
            for (var i = 1; i <= val; i++) {
                this.view.Feedback["imgRating" + i].skin = "sknLblFontType0273E330px";
                this.view.Feedback["imgRating" + i].text = "F";
            }
            for (i = (val + 1); i <= 5; i++) {
                this.view.Feedback["imgRating" + i].skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback["imgRating" + i].text = "k";
            }
            for (i = 1; i <= 5; i++) {
                this.view.CustomerFeedbackDetails["imgRating" + i].skin = this.view.Feedback["imgRating" + i].skin;
                this.view.CustomerFeedbackDetails["imgRating" + i].text = this.view.Feedback["imgRating" + i].text;
            }
            this.enableButton(this.view.Feedback.confirmButtons.btnConfirm);
            var rating = val.toString();
            this.feedbackRating = rating;
            this.view.forceLayout();
        },
        /**
         * Show Ratings
         * @member frmCustomerFeedbackController
         * @param {Int} val
         * @returns {void} - None
         * @throws {void} - None
         */
        showRatingActionCircle: function (val) {
            for (var i = 1; i <= val; i++) {
                this.view.FeedbackSurvey["imgRating" + i].src = ViewConstants.IMAGES.CIRCLE_BLUE_FILLED;
            }
            for (i = (val + 1); i <= 5; i++) {
                this.view.FeedbackSurvey["imgRating" + i].src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
            }
            this.enableButton(this.view.FeedbackSurvey.confirmButtons.btnConfirm);
            this.view.forceLayout();
        },
        /**
         * Show Add Feature Request UI
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        addFeatureRequestAction: function () {
            this.view.Feedback.flxAddFeatureRequest.setVisibility(false);
            this.view.Feedback.flxUserFeedback.setVisibility(true);
            this.view.forceLayout();
        },
        /**
         * Show Survey UI
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        TakeSurveyAction: function () {
            this.view.flxFeedback.setVisibility(false);
            this.view.flxFeedbackMoneyTransferProcess.setVisibility(true);
            this.view.flxFeedbackAcknowledgement.setVisibility(false);
            this.view.flxAcknowledgementContainer.setVisibility(false);
        },
        /**
         * Calls presenter function to submit feedback
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        addSubmitAction: function () {
            var self = this;
            FormControllerUtility.showProgressBar(this.view);
            var feedback = {
                'rating': self.feedbackRating,
                'description': self.view.Feedback.txtareaUserComments.text.trim(),
                'featureRequest': self.view.Feedback.txtareaUserAdditionalComments.text.trim(),
            };
            self.loadFeedbackModule().presentationController.createFeedback(feedback);
        },
        /**
         * Show feedback confirmation screen
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        submitFeedbackSuccessFlow: function () {
            var self = this;
            FormControllerUtility.hideProgressBar(this.view);
            var customerFeedback = self.view.CustomerFeedbackDetails;
            var feedback = self.view.Feedback;
            customerFeedback.lblcomments.text = feedback.txtareaUserComments.text.trim();
            customerFeedback.lblAnswer1.text = feedback.txtareaUserAdditionalComments.text.trim();
            if (feedback.txtareaUserComments.text.trim() === "") {
                customerFeedback.lblcomments.text = kony.i18n.getLocalizedString("i18n.common.none");
            }
            if (feedback.txtareaUserAdditionalComments.text.trim() === "") {
                customerFeedback.lblAnswer1.text = kony.i18n.getLocalizedString("i18n.common.none");
            }
            self.view.flxFeedback.setVisibility(false);
            self.view.flxFeedbackAcknowledgement.setVisibility(false);
            self.view.flxAcknowledgementContainer.setVisibility(true);
            self.view.forceLayout();
        },
        /**
         * Reset Feedback form if ratings were done, else navigate to Accounts dashboard
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        addCancelAction: function () {
            var feedback = this.view.Feedback;
            if (this.view.Feedback.imgRating1.skin === "sknLblFontType0273E330px" && this.view.Feedback.imgRating1.text === "F") {
                this.view.Feedback.imgRating1.skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback.imgRating1.text = "k";
                this.view.Feedback.imgRating2.skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback.imgRating2.text = "k";
                this.view.Feedback.imgRating3.skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback.imgRating3.text = "k";
                this.view.Feedback.imgRating4.skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback.imgRating4.text = "k";
                this.view.Feedback.imgRating5.skin = "sknLblFontTypeIcona0a0a020px";
                this.view.Feedback.imgRating5.text = "k";
                this.disableButton(feedback.confirmButtons.btnConfirm);
                feedback.txtareaUserComments.text = "";
                feedback.txtareaUserAdditionalComments.text = "";
                feedback.txtareaUserComments.onKeyUp();
                feedback.txtareaUserAdditionalComments.onKeyUp();
                feedback.flxAddFeatureRequest.setVisibility(true);
                feedback.flxUserFeedback.setVisibility(false);
                this.view.forceLayout();
            } else {
                this.loadFeedbackModule().presentationController.cancelAction();
            }
        },
        /**
         * Navigate to Accounts Dashboard
         * @member frmCustomerFeedbackController
         * @param {void} - None
         * @returns {void} - None
         * @throws {void} - None
         */
        showAccountModule: function () {
            var accountModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule");
            accountModule.presentationController.showAccountsDashboard();
        },
        /**
         * Disable button
         * @member frmCustomerFeedbackController
         * @param {String} button
         * @returns {void} - None
         * @throws {void} - None
         */
        disableButton: function (button) {
            button.setEnabled(false);
            button.skin = ViewConstants.SKINS.BLOCKED;
            button.hoverSkin = ViewConstants.SKINS.BLOCKED;
            button.focusSkin = ViewConstants.SKINS.BLOCKED;
        },
        /**
         * Enable button
         * @member frmCustomerFeedbackController
         * @param {String} button
         * @returns {void} - None
         * @throws {void} - None
         */
        enableButton: function (button) {
            if (!CommonUtilities.isCSRMode()) {
                button.setEnabled(true);
                button.skin = ViewConstants.SKINS.NORMAL;
                button.hoverSkin = ViewConstants.SKINS.HOVER;
                button.focusSkin = ViewConstants.SKINS.FOCUS;
            }
        },
        /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmAccountsLandingController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
        orientationHandler: null,
        onBreakpointChange: function (width) {
            var scope = this;
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomFooterMain.lblCopyright.text = kony.i18n.getLocalizedString("i18n.footer.copyright");
            kony.print('on breakpoint change');
            if (this.orientationHandler === null) {
                this.orientationHandler = new OrientationHandler();
            }
            this.orientationHandler.onOrientationChange(this.onBreakpointChange);
            this.view.customheader.onBreakpointChangeComponent(width);
            this.setupFormOnTouchEnd(width);
            var scope = this;
            if (width === 640) {
                this.view.Feedback.lblRatingtxt.skin = "sknLabelSSP8F8F8F10pxnormal";
                this.view.Feedback.flxMain.top = "30dp";
                this.view.CustomPopupLogout.width = "75%";
            } else {
                this.view.Feedback.lblRatingtxt.skin = "sknLabelSSP8F8F8F15pxnormal";
            }
            this.AdjustScreen();
        },
        setupFormOnTouchEnd: function (width) {
            if (width == 640) {
                this.view.onTouchEnd = function () { }
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function () { }
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function () {
                        hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function () { }
                    this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function () { }
                    this.nullifyPopupOnTouchStart();
                }
            }
        },
        nullifyPopupOnTouchStart: function () { }
    }



    //=========================================MY CODE=========================================





});

// onSelectionRadioButton: function (){



//     // Working with Calendar for Form 3

//   onSelectionCalendarUnderWidget: function (){
//     const calendarContext = {
//         "widget": "Calendar",
//   "calendarForForm3": this.view.calendarForForm3,
//   "anchor": "bottom"


//   };

//   //setContext method call
//    this.view.calendarForForm3.setContext(calendarContext);

// };

//  // data from From 3
//  onNavigate : function(context) {

//     //     alert(JSON.stringify(context));

//         const dataFromForm3InJSON = JSON.stringify(context)

//         this.view.lblContextForForm5.text = dataFromForm3InJSON;

//         this.view.lblContextForForm5.text = context;
//         this.view.lblContextForForm5.text = context["widget"];
//         this.view.lblContextForForm5.text = context["calendarForForm3"];
//         this.view.lblContextForForm5.text = context["anchor"];

//         this.view.lblContextForForm5.text = context.widget;
//         this.view.lblContextForForm5.text = context.calendarForForm3;
//         this.view.lblContextForForm5.text = context.anchor;
//     } view.lblContextForForm5.text = dataFromForm3InJSON;



//     //     this.view.lblContextForForm5.text =  dataFromForm3InJSON["lblName"];

//       },


//   onAddingDataToListBox: function() {
//     this.view.listBoxForForm5.masterData.

//         //Defining properties for a listbox.
//         const listBasic = {
//           id: "listBoxForForm5",
//           isVisible: true,
//           masterData: [
//             ["id_1", "value1"],
//             ["id_2", "value2"],
//             ["id_3", "value3"],
//             ["id_4", "value4"],

//           ],
//     //       skin: "listSkin",
//     //       focusSkin: "listFSkin"
//         };

//         //Creating the ListBox.
//         const listbx = new kony.ui.ListBox(listBasic);

//         //Reading the containerWeight of the listbox		
// //         alert("listbox containerWeight ::" + listbx.containerWeight);

// 			alert("listbox containerWeight ::" + listbx.id);

// const dataList = [
//   ["id_1", "value1"],
//   ["id_2", "value2"],
//   ["id_3", "value3"]
// ];
//   this.view.listBoxForForm5.masterData = dataList;

// },

// onSelectionListBox: function (){
//     const listContext = {
//         "widget": "ListBox",
//         "listBoxForForm5": this.view.listBoxForForm5,
//         "anchor": "bottom"
//     };
//     this.view.listBoxForForm5.setContext(listContext);
// },







//     frmList.myList.viewType = constants.LISTBOX_VIEW_TYPE_EDITVIEW;
// this.view.listBoxForForm5.viewType = constants.LISTBOX_VIEW_TYPE_EDITVIEW;


// onClickBtnSaveNaviagteFromForm4ToForm6WithData: function(){



//     const ntf = new kony.mvc.Navigation("frm6InfoDataForUser");

//    const myContext = {
//                  lblForFirstName: this.view.EntryForm.txtFieldFirstName.text,
//                  lblForLastName: this.view.EntryForm.txtFieldLastName.text,
//                  lblForEmail: this.view.EntryForm.txtFieldEmail.text,
//                  lblForDepartment: this.view.EntryForm.txtFieldDepartment.text

//    };

//     ntf.navigate(myContext);


//  },


//  onNavigate : function (context, isBackNavigation) {

//     this.view.lblDataOnForm6.text = context.lblForFirstName; // From Form 1 button onClick.
//     this.view.lblLastNameForm6.text = context.lblForLastName;
//     this.view.lblEmailForm6.text =	context.lblForEmail;
//     this.view.lblDepartmentFrom6.text = context.lblForDepartment;




//    alert("Word is "+ this.view.lblDataOnForm6.text, 
//          this.view.lblLastNameForm6.text, 
//          this.view.lblEmailForm6.text, this.view.lblDepartmentFrom6.text );


//  }


//  onNavigate : function (context, isBackNavigation) {

//     this.view.lblDataOnForm6.text = context.lblForFirstName; // From Form 1 button onClick.


// function setMasterDataToSegment() {



//     frmHome.segmentPost.widgetDataMap = {
//         imgProfilePic: "imgProfilePic", lblProfileName: "lblProfileName", lblLocation: "lblLocation",

//         imgActivityFeed: "imgActivityFeed", lblLikecount: "lblLikecount", btnLike: "btnLike", btnComment: "btnComment", lblTimeStamp: "lblTimeStamp"
//     };



//     var masterData = [



//         [

//             { imgProfilePic: { src: "profile_detail_profile_example.png" }, lblProfileName: "Migue.P", lblLocation: "Memphis,TN" },

//             [

//                 {
//                     imgActivityFeed: { src: "profile_detail_profile_example.png" }, lblLikecount: "750", btnLike: { "skin": skbtntransbg }, btnComment: { "skin": skbtntransbg },

//                     lblTimeStamp: "1"
//                 }

//             ]

//         ],

//         [

//             { imgProfilePic: { src: "profile_detail_profile_example.png" }, 
//                              lblProfileName: "Migue.Peter",
//                              lblLocation: "Memphis,TN" },

//             [

//                 {
//                     imgActivityFeed: { src: "profile_detail_profile_example.png" }, 
//                                     lblLikecount: "750", 
//                                     btnLike: { "skin": skbtntransbg }, 
//                                                 btnComment: 
//                                                         { "skin": skbtntransbg },

//                                     lblTimeStamp: "2"
//                                                  }

//             ]

//         ],

//         [

//             { imgProfilePic: { src: "profile_detail_profile_example.png" }, lblProfileName: "Migue.P.John", lblLocation: "Memphis,TN" },

//             [

//                 {
//                     imgActivityFeed: { src: "profile_detail_profile_example.png" }, lblLikecount: "750", btnLike: { "skin": skbtntransbg }, btnComment: { "skin": skbtntransbg },

//                     lblTimeStamp: "3"
//                 }

//             ]

//         ]



//     ];

//     frmHome.segmentPost.setData(masterData);




onSliderCallbck: function () {

    //Defining the properties for Switch.
    const swtchBasic = {
      id: "switchOnForm15",
      info: {
        key: "switch" 
      },
      leftSideText: "on",
      rightSideText: "off",
      skin: "swchSkin",
      selectedIndex: 0,
      isVisible: true,
      onSlide: onSliderCallbck
    };

    const swtchLayout = {
      margin: [5, 5, 5, 5],
      marginInPixel: false,
      widgetAlignment: constants.WIDGET_ALIGN_TOP_LEFT,
      containerWeight: 99
    };
    
   

    //Creating the Switch.
    const swtch = new kony.ui.Switch(swtchBasic, swtchLayout, {})

    //Reading the id of the Switch
    alert("Switch id is ::" + swtch.id);  

 if( this.view.switchOnForm15.selectedIndex == 0){
       this.view.AlertBox.opacity =  1;
    } else if((swtchBasic.rightSideText == true)) {
       this.view.AlertBox.opacity =  0;
    }
  }


  if( )




