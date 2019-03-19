sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, Button, Bar, MessageToast) {

	return Component.extend("com.sap.rig.demo.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!
			
			//Get Date
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth();
			var yyyy = today.getFullYear();
			var text1 = dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();
			
			//Get Username
			var uname = sap.ushell.Container.getUser().getFullName();
			var text2 = "Welcome, " + uname;
			
			//Get cookie context
			var qk = document.cookie.split("sap-usercontext=");
			var qk1 = qk[1].split(";");
			var qk2 = qk1[0].split("&");
			var qk3 = qk2[1].split("sap-client=");
			var clnt = qk3[1].toString();
			var text3 = "Client: " + clnt;
			
			//Get client and username;
			var text4 = text3 + " | " + uname;
			
			rendererPromise.then(function (oRenderer) {
				oRenderer.setHeaderTitle(text4);
			});

			/**
			 * Add item to the header
			 */
/*			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderItem({
					icon: "sap-icon://add",
					tooltip: "Add bookmark",
					press: function () {
						MessageToast.show("This SAP Fiori Launchpad has been extended to improve your experience");
					}
				}, true, true);
			});*/

		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});