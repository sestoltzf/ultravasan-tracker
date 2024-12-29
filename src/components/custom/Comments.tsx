// src/components/custom/Comments.tsx
import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  activityId: string;
  author: string;
  comment: string;
  date: string;
  status: "Published" | "Draft";
  userId: string;
}

const Comments = ({
  activityId,
  loggedInUserId,
  isAdmin,
  adminKey,
  setIsAdmin,
}: {
  activityId: string;
  loggedInUserId: string;
  isAdmin: boolean;
  adminKey?: string;
  setIsAdmin: (isAdmin: boolean) => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    const fetchComments = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/comments?activityId=${activityId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [activityId]);

  const handleSubmitComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newComment) return;

    const author = authorName.trim() || "Anonym";

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          comment: newComment,
          author,
          userId: loggedInUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const savedComment: Comment = await response.json();
      setComments((prev) => [savedComment, ...prev]);
      setNewComment("");
      setAuthorName("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: commentId,
          userId: loggedInUserId,
          adminKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!editedComment || !editingCommentId) return;

    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCommentId,
          comment: editedComment,
          userId: loggedInUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment: Comment = await response.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Kommentarer</h2>

      {/* Admin Login Button */}
      {!isAdmin && (
        <div className="mb-4">
          <button
            onClick={() => {
              const key = prompt("Ange Admin-nyckel:");
              if (key === adminKey) {
                setIsAdmin(true);
                alert("Adminläge aktiverat!");
              } else {
                alert("Fel nyckel!");
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Aktivera Admin-läge
          </button>
        </div>
      )}

      {/* Kommentarlista */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{comment.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.date).toLocaleDateString("sv-SE")}
                </p>
              </div>
              {(loggedInUserId === comment.userId || isAdmin) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCommentId(comment.id)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Ta bort
                  </button>
                </div>
              )}
            </div>
            {editingCommentId === comment.id ? (
              <form onSubmit={handleEditComment} className="mt-4">
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Redigera din kommentar"
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Spara
                </button>
              </form>
            ) : (
              <p className="mt-2 text-gray-700">{comment.comment}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lägg till ny kommentar */}
      <form onSubmit={handleSubmitComment} className="mt-6 space-y-4">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Ditt namn (valfritt)"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Skriv en kommentar..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Lägg till
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comments;
