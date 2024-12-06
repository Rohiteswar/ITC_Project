import { NextResponse } from "next/server";
import dynamoClient from "@/lib/dynamoClient";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req: Request) {
  const { bookId, userId } = await req.json();

  const params = {
    TableName: "LibraryBooks",
    Key: {
      id: { S: bookId },
    },
    UpdateExpression: "set borrowedBy = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    await dynamoClient.send(new UpdateItemCommand(params));
    return NextResponse.json({ message: "Book borrowed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error borrowing book" }, { status: 500 });
  }
}
