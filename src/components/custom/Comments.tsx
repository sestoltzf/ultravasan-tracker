// src/components/custom/Comments.tsx
import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  activityId: string;
  author: string;
  comment: string;
  date: string;
  status: "Published" | "Draft";
}

const CommentSection = ({ activityId }: { activityId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

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

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityId, comment: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const savedComment: Comment = await response.json();
      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Kommentarslista */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.comment}</p>
          </div>
        ))}
      </div>

      {/* Kommentarsformulär */}
      <form onSubmit={handleSubmitComment} className="mt-4">
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
            Skicka
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
