import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

function Sidebar() {
    // using selector to get the user state from redux store
    const user = useSelector((state) => state.user);
    // using dispatch to update the state of userSlice in redux store
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    // function to join the room
    function joinRoom(room, isPublic = true) {
        // check if user is logged in
        if (!user) {
            return alert("Please login");
        }
        // emit socket event to join room
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);

        // set the privateMemberMsg to null if the room is public
        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        // dispatch an action to reset the notifications for the room
        dispatch(resetNotifications(room));
    }

    // listen to socket event for notifications
    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom != room) dispatch(addNotifications(room));
    });

    // useEffect hook to set current room to "general", get all the available rooms and emit socket events
    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
        }
    }, []);

    // listen to socket event for new user and set the members state
    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    // function to get all the available rooms
    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    // function to order the ids of the members
    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    // function to handle private member message and join the room
    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId, false);
    }

    // if user is not logged in, return empty
    if (!user) {
        return <></>;
    }
    return (
        <>
            <h2>Available rooms</h2>
            <ListGroup>
                {/* map through all the available rooms and show them in a list */}
                {rooms.map((room, idx) => (
                    <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                        {room} {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessages[room]}</span>}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <br></br>
            <h2>Members</h2>
            {/* map through all the members and show them in a list */}
                {members.map((member) => (
                    <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
                        <Row>
                            <Col xs={2} className="member-status">
                                <img src={member.picture} className="member-status-img" />
                                {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                            </Col>
                            <Col xs={9}>
                                {member.name}
                                {member._id === user?._id && " (You)"}
                                {member.status == "offline" && " (Offline)"}
                            </Col>
                            <Col xs={1}>
                                <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
        </>
    );
}

export default Sidebar;
