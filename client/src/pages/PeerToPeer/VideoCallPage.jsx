import React, { useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";

function randomID(len) {
   let result = "";
   if (result) return result;
   var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
   len = len || 5;
   for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
   }
   return result;
}

export function getUrlParams(url = window.location.href) {
   let urlStr = url.split("?")[1];
   return new URLSearchParams(urlStr);
}

const appId = 895922158;
const ServerSecret = "bdf4308c84ba30167dae2e6df1339782";

const VideoCallPage = () => {
   const { id } = useParams();
   console.log("Id: ", id);
   const roomID = getUrlParams().get("roomID") || randomID(5);
   const myMeetingRef = useRef(null);

   useEffect(() => {
      const startMeeting = async () => {
         if (myMeetingRef.current) {
            // generate Kit Token
            const appID = appId;
            const serverSecret = ServerSecret;
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
               appID,
               serverSecret,
               roomID,
               id,
               "Admin"
            );

            // Create instance object from Kit Token.
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            // start the call
            zp.joinRoom({
               container: myMeetingRef.current,
               sharedLinks: [
                  {
                     name: "Personal link",
                     url:
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "?roomID=" +
                        roomID,
                  },
               ],
               scenario: {
                  mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
               },
            });
         }
      };

      startMeeting();

      // Cleanup function (optional, but good practice)
      return () => {
         // You might want to add cleanup logic here if needed,
         // such as destroying the ZegoUIKitPrebuilt instance.
      };
   }, [roomID]); // Re-run effect when roomID changes

   return (
      <div
         className="myCallContainer"
         ref={myMeetingRef}
         style={{ width: "100vw", height: "100vh" }}
      ></div>
   );
};

export default VideoCallPage;
