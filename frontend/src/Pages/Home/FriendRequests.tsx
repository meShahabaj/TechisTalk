// import { useEffect, useState } from "react";
// import axios from "axios";

// const BACKEND_API = process.env.REACT_APP_BACKEND_API;

// const FriendRequests = () => {
//     const [requests, setRequests] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     const loadRequests = async () => {
//         try {
//             const res = await axios.get(`${BACKEND_API}/friend-request/get`, {
//                 withCredentials: true,
//             });
//             setRequests(res.data.requests);
//             console.log(res.data.requests)
//         } catch {
//             console.error("Failed to load requests");
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         loadRequests();
//     }, []);

//     const acceptRequest = async (fromUserId: string) => {
//         await axios.post(
//             `${BACKEND_API}/friend-request/accept`,
//             { fromUserId },
//             { withCredentials: true }
//         );
//         loadRequests();
//     };

//     const rejectRequest = async (fromUserId: string) => {
//         await axios.post(
//             `${BACKEND_API}/friend-request/reject`,
//             { fromUserId },
//             { withCredentials: true }
//         );
//         loadRequests();
//     };

//     /* ---------------- LOADING SKELETON ---------------- */
//     if (loading) {
//         return (
//             <div className="p-10 ml-0 md:ml-64">
//                 <div className="max-w-xl mx-auto space-y-4">
//                     {[1, 2, 3].map((i) => (
//                         <div
//                             key={i}
//                             className="h-20 bg-gray-900/60 rounded-2xl border border-gray-800 animate-pulse"
//                         />
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="">
//             <div className="max-w-xl mx-auto">

//                 <h1 className="text-3xl font-bold text-white mb-6">
//                     Friend Requests
//                 </h1>

//                 {requests.length === 0 ? (
//                     <p className="text-gray-400">No friend requests.</p>
//                 ) : (
//                     <div className="space-y-4">
//                         {requests.map((req) => (
//                             <div
//                                 key={req.id}
//                                 className="bg-gray-900/80 backdrop-blur-lg border border-gray-800
//                                            text-white p-5 rounded-2xl shadow flex justify-between items-center"
//                             >
//                                 <div>
//                                     <p className="font-semibold text-lg">
//                                         {req.from.username}
//                                     </p>
//                                     <p className="text-gray-400 text-sm">
//                                         {req.from.email}
//                                     </p>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={() => acceptRequest(req.from.id)}
//                                         className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 
//                                                    transition shadow text-white"
//                                     >
//                                         Accept
//                                     </button>

//                                     <button
//                                         onClick={() => rejectRequest(req.from._id)}
//                                         className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
//                                                    transition shadow text-white"
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FriendRequests;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const FriendRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadRequests = async () => {
        try {
            const res = await axios.get(`${BACKEND_API}/friend-request/get`, {
                withCredentials: true,
            });
            setRequests(res.data.requests);
        } catch {
            console.error("Failed to load requests");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const acceptRequest = async (fromUserId: string) => {
        await axios.post(
            `${BACKEND_API}/friend-request/accept`,
            { fromUserId },
            { withCredentials: true }
        );
        loadRequests();
    };

    const rejectRequest = async (fromUserId: string) => {
        await axios.post(
            `${BACKEND_API}/friend-request/reject`,
            { fromUserId },
            { withCredentials: true }
        );
        loadRequests();
    };

    if (loading) {
        return (
            <div className="p-10 ml-0 md:ml-64">
                <div className="max-w-xl mx-auto space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 bg-gray-900/60 rounded-2xl border border-gray-800 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div >
            <div className="max-w-xl mx-auto py-10">
                <h1 className="text-3xl font-bold text-white mb-6">Friend Requests</h1>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 mt-20">
                        <p className="text-gray-400 text-center text-lg">
                            You have no friend requests.
                        </p>
                        <button
                            onClick={() => navigate("/search-friends")}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700
                         transition text-white font-medium shadow-lg"
                        >
                            Find Friends
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-gray-900/80 backdrop-blur-lg border border-gray-800
                           text-white p-5 rounded-2xl shadow-lg flex justify-between items-center
                           transition hover:scale-[1.02] duration-200"
                            >
                                <div>
                                    <p className="font-semibold text-lg">{req.from.username}</p>
                                    <p className="text-gray-400 text-sm">{req.from.email}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(req.from.id)}
                                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 
                               transition shadow text-white font-medium"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => rejectRequest(req.from.id)}
                                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
                               transition shadow text-white font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequests;
