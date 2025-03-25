import React, { useContext } from "react";
import Avatar from "react-avatar";
import Button from "../../helpers/Button";
import { funcContext } from "../../contexts/context";

const Roomusermodal = ({ members, setUserPopup, socketRef, roomCode }) => {
  const { userData } = useContext(funcContext);

  const removeUserFromRoom = (i) => {
    console.log(members[i]);
    socketRef.emit("remove-user-from-room", {
      roomCode,
      userSocketId: members[i].userSocketId,
      memberEmail: members[i].memberEmail,
    });
    setUserPopup(false);
  };

  return (
    <div className="room-users-wrapper p-10 cursor-pointer rounded-3xl shadow-theme w-[50vw] bg-black relative text-start">
      <div className="heading text-white text-2xl text-start font-extrabold mt-4">
        Users connected in the room ↴
      </div>

      <div className="members-in-room mt-5 mb-12 pr-5 max-h-[50vh] overflow-y-scroll">
        {members.length == 0 && (
          <div className="text-[grey] font-semibold">
            No users connected yet besides the host ⚠️
          </div>
        )}
        {members.map((m, i) => {
          return (
            <div className="my-5 flex justify-between items-center bg-sub px-5 py-3 rounded-lg">
              {/* avatar, name and email  */}
              <div className="flex justify-start items-center gap-5">
                <Avatar name={m.memberName} size="50" round={true} />
                <div className="capitalize text-sm text-white font-semibold">
                  {m.memberName}
                  <div className="normal-case font-normal text-[grey] text-xs ">
                    {m.memberEmail}
                  </div>
                </div>
              </div>

              {/* host or not  */}
              {m.isHost && (
                <div className="isHost text-white bg-black lg:p-2 xl:px-6 xl:py-3 rounded-full">
                  Room host
                </div>
              )}

              {i > 0 && members[0].memberEmail === userData.email && (
                <Button
                  text={"Remove"}
                  textColor={"white"}
                  backgroundColor={"red"}
                  width={120}
                  padding={8}
                  borderRadius={20}
                  onClick={() => removeUserFromRoom(i)}
                />
              )}
            </div>
          );
        })}
      </div>

      <Button
        text={"Cancel"}
        width={"20%"}
        onClick={setUserPopup}
        textColor={"white"}
        backgroundColor={"red"}
        borderRadius={6}
        padding={12}
      />
    </div>
  );
};

export default Roomusermodal;
