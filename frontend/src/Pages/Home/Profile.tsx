import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: "",
        email: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // FETCH PROFILE DIRECTLY
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${BACKEND_API}/user/profile`, {
                    withCredentials: true,
                });

                console.log(res.data)

                setProfile({
                    username: res.data.data.username,
                    email: res.data.data.email,
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
            }
        };

        fetchProfile();
    }, []);

    // SAVE CHANGES
    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append("username", profile.username);

            await axios.put(
                `${BACKEND_API}/users/update-profile`,
                formData,
                { withCredentials: true }
            );

            alert("Profile updated successfully!");
            setIsEditing(false);

            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    // DELETE ACCOUNT
    const deleteAccount = async () => {
        if (!window.confirm("This action is permanent. Continue?")) return;

        try {
            setLoading(true);
            await axios.delete(`${BACKEND_API}/auth/delete`, {
                withCredentials: true
            });
            navigate("/signup");
        } catch {
            alert("Delete failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-white">
                    Profile Settings
                </h2>

                {/* PROFILE CARD */}
                <div className="bg-gray-900/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold text-white">
                                {profile.username}
                            </h3>
                            <p className="text-gray-300">{profile.email}</p>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white 
                               hover:bg-blue-700 transition shadow"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                {/* DELETE ACCOUNT */}
                <div className="mt-8">
                    <button
                        onClick={deleteAccount}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold 
                           bg-gradient-to-r from-red-500 to-red-700 
                           text-white shadow-lg hover:opacity-90 
                           transition disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-700 text-gray-200">
                        <h3 className="text-2xl font-bold mb-6">
                            Edit Profile
                        </h3>

                        <label className="block mb-4">
                            <span className="text-sm font-semibold">Username</span>
                            <input
                                type="text"
                                className="w-full border border-gray-600 bg-gray-800 text-white p-3 rounded-xl mt-1 
                                   focus:ring-2 focus:ring-blue-500 outline-none"
                                value={profile.username}
                                onChange={(e) =>
                                    setProfile({ ...profile, username: e.target.value })
                                }
                            />
                        </label>

                        <label className="block mb-6">
                            <span className="text-sm font-semibold">Email</span>
                            <input
                                type="text"
                                className="w-full border border-gray-600 bg-gray-800 text-white p-3 rounded-xl mt-1 
                                   focus:ring-2 focus:ring-blue-500 outline-none"
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({ ...profile, email: e.target.value })
                                }
                            />
                        </label>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveChanges}
                                className="px-5 py-2 rounded-xl bg-blue-600 text-white 
                                   hover:bg-blue-700 transition shadow"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );


};

export default Profile;
