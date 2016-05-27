/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 'use strict';

 var dfrobot = {
    service: "0000dfb0-0000-1000-8000-00805f9b34fb",
    characteristic: "0000dfb1-0000-1000-8000-00805f9b34fb"
 };

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false);
        sendButton.addEventListener('touchstart', this.sendData, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.refreshDeviceList();
    },

    refreshDeviceList: function () {
        deviceList.innerHTML = '';
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },

    onDiscoverDevice: function (device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;
        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },

    connect: function () {
        var deviceId = event.target.dataset.deviceId;
        var onConnect = function (device) {
            disconnectButton.dataset.deviceId = deviceId;
            sendButton.dataset.deviceId = deviceId;
            app.showDetailPage();
            //alert("Connected to " + device.name);
            alert(JSON.stringify(device));
            //app.syncUI(deviceId);
        };

        ble.connect(deviceId, onConnect, app.onError);
    },

    disconnect: function () {
        var deviceId = event.target.dataset.deviceId;
        //alert(deviceId);
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    
    sendData: function () {
        var dataReceived = inputArea.value;
        //alert("data: " + inputArea.value);
        var data = new Uint8Array(1);
        var deviceId = event.target.dataset.deviceId;
        
        var onSend = function () {
            alert("Data sended!");
        };
        
        data[0] = dataReceived;
        //alert(deviceId);
        //alert(data.buffer);
        //alert(data[0]);
        ble.write(deviceId, dfrobot.service, dfrobot.characteristic, data.buffer, app.onSend, app.onError);
        //ble.writeWithoutResponse(deviceId, dfrobot.service, dfrobot.characteristic, data.buffer, app.onSend, app.onError);
    },
    
    //////////////////////////////////////tool function///////////////////////////

    showDetailPage: function () {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },

    showMainPage: function () {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },

    onSend: function () {
        display("Data send!");
    },

    onError: function (reason) {
        alert("ERROR: " + reason);
    },

    display: function (message) {
        var display = document.getElementById("message"),
            lineBreak = document.createElement("br"),
            label = document.createTextNode(message);
        
        display.appendChild(lineBreak);
        display.appendChild(label);
    }
};

app.initialize();
