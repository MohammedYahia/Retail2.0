/*
 * Copyright (c) TEMENOS HEADQUARTERS SA, All rights reserved.
 *
 * This source code is protected by copyright laws and international copyright treaties,
 * as well as other intellectual property laws and treaties.
 *  
 * Alteration, duplication or redistribution of this source code in any form 
 * is not permitted without the prior written authorisation of TEMENOS HEADQUARTERS SA.
 * 
 */

function webSocketStart(contextPath, encodedSessionId)
{
    var isFreshWebSocket = setupWebSocketObject(contextPath, encodedSessionId);

    var ws = getVariable('', "websocketObject", undefined);
    if (ws)
    {
        if (isFreshWebSocket || ws.readyState == 0)
        {
            configureWebSocketObject(ws, webSocketRuleList);
        }
        else
        {
            ws.send(webSocketRuleList);
        }
    }

    return ws;
}

function setupWebSocketObject(contextId, encodedSessionId)
{
    var websocketObject = getVariable('', "websocketObject", undefined);
    if (!websocketObject)
    {
        var location = window.location;

        var hostname = location.hostname;
        var portNumber = location.port;
        if (!contextId)
        {
            return;
        }
        var pathname = contextId + "/websocketcontroller";
        var protocol = location.protocol;
        if (protocol === "http:")
        {
            protocol = "ws:";
        }
        else if (protocol === "https:")
        {
            protocol = "wss:";
        }
        
        var port = portNumber ? ":" + portNumber : "";
        var fullURL = protocol + "//" + hostname + port + pathname + "/?" + encodedSessionId;
        // this hook allows updating the connection url for the http
		// request that starts websockets; as it is now, websockets only pass
		// an anonymous query string parameter that is assumed to be a
		// sessionID
		// this hook is needed to accomodate application filters that check
		// requests for specific parameters
        if (this["alterWebsocketConnectionUrl"])
        {
            fullURL = alterWebsocketConnectionUrl(fullURL);
        }
        
        websocketObject = new WebSocket(fullURL);
        setVariable('', "websocketObject", websocketObject);

        return true;
    }
    return false;
}

function configureWebSocketObject(ws, wsRuleList)
{
    ws.onopen = function ()
    {
        ws.send(wsRuleList);
    };

    ws.onmessage = function (evt)
    {
        var objData = JSON.parse(evt.data);
        processAjaxResponses("", "ajaxQLR", true, objData);
    };
}

function addToWebsocketRuleList(paramId, contextId, encodedSessionId) {
    webSocketRuleList = [];
    webSocketRuleList[0] = paramId;
    webSocketStart(contextId, encodedSessionId);
}
