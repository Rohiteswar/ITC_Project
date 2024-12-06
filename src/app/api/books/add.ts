import { NextResponse } from "next/server";
import dynamoClient from "@/lib/dynamoClient";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req: Request) {
  const { title, author } = await req.json();

  if (!title || !author) {
    return NextResponse.json({ error: "Title and Author are required" }, { status: 400 });
  }

  const params = {
    TableName: "LibraryBooks",
    Item: {
      id: { S: `${Date.now()}` },
      title: { S: title },
      author: { S: author },
    },
  };

  try {
    await dynamoClient.send(new PutItemCommand(params));
    return NextResponse.json({ message: "Book added successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error adding book" }, { status: 500 });
  }
}
