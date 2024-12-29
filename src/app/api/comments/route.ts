import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

interface Comment {
  id: string;
  activityId: string;
  author: string;
  comment: string;
  date: string;
  status: "Published" | "Draft";
  userId: string;
}

const readCommentsFromFile = (): Comment[] => {
  try {
    const data = fs.readFileSync(commentsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading comments file:", error);
    return [];
  }
};

const writeCommentsToFile = (comments: Comment[]): void => {
  try {
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error("Error writing to comments file:", error);
  }
};

// GET: Fetch comments for an activity
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");

    const allComments = readCommentsFromFile();
    const filteredComments = activityId
      ? allComments.filter((comment: Comment) => comment.activityId === activityId)
      : allComments;

    return NextResponse.json(filteredComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Add a new comment
export async function POST(request: Request) {
  try {
    const { activityId, comment, author, userId } = await request.json();
    if (!activityId || !comment || !author || !userId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const allComments = readCommentsFromFile();
    const newComment: Comment = {
      id: crypto.randomUUID(),
      activityId,
      author,
      comment,
      date: new Date().toISOString(),
      status: "Published",
      userId,
    };

    allComments.push(newComment);
    writeCommentsToFile(allComments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

// DELETE: Remove a comment
export async function DELETE(request: Request) {
  try {
    const { id, userId, adminKey } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const allComments = readCommentsFromFile();
    const commentIndex = allComments.findIndex((c: Comment) => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if the user is the comment owner or an admin
    if (
      allComments[commentIndex].userId !== userId &&
      adminKey !== process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Remove the comment
    allComments.splice(commentIndex, 1);
    writeCommentsToFile(allComments);

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
