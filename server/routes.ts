import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
import OpenAI from 'openai';
import xlsx from 'xlsx';
dotenv.config();

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Commenting, Friending, Posting, Rating, Selling, Sessioning } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  //////////////////////////////////// sessioning ////////////////////////////////////
  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  //////////////////////////////////// posting ////////////////////////////////////
  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  //////////////////////////////////// friending ////////////////////////////////////
  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  //////////////////////////////////// selling ////////////////////////////////////
  @Router.get("/items")
  @Router.validate(z.object({ user: z.string().optional() }))
  async getItems(_id?: string, user?: string) {
    let items;
    if (_id) {
      items = await Selling.getById(new ObjectId(_id));
    } else if (user) {
      const id = (await Authing.getUserByUsername(user))._id;
      items = await Selling.getBySeller(id);
    } else {
      items = await Selling.getItems();
    }
    return Responses.items(items);
  }

  @Router.post("/items")
  async createItem(session: SessionDoc, name: string, cost: number, description: string, picture: string, contact: string) {
    const user = Sessioning.getUser(session);
    const created = await Selling.create(user, name, cost, description, picture, contact);
    return { msg: created.msg, post: await Responses.item(created.item) };
  }

  @Router.patch("/items/:itemId")
  async updateItem(session: SessionDoc, id: string, name?: string, cost?: number, description?: string, picture?: string, contact?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Selling.assertSellerIsUser(oid, user);
    return await Selling.update(oid, name, cost, description, picture, contact);
  }

  @Router.delete("/items/:itemId")
  async deleteItem(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Selling.assertSellerIsUser(oid, user);
    return Selling.delete(oid);
  }

  //////////////////////////////////// commenting ////////////////////////////////////
  @Router.get("/items/:itemId/comments")
  async getComents(itemId: ObjectId) {
    const comments = await Commenting.getByItem(itemId);
    return Responses.comments(comments);
  }

  @Router.post("/items/:itemId/comments")
  async createComment(session: SessionDoc, itemId: ObjectId, comment: string) {
    const user = Sessioning.getUser(session);
    const created = await Commenting.createComment(itemId, comment, user);
    return { msg: created.msg, comment: await Responses.comment(created.comment) };
  }

  @Router.patch("/items/:itemId/comments/:commentId")
  async editComment(session: SessionDoc, itemId: string, commentId: string, comment?: string) {
    const user = Sessioning.getUser(session);
    const itemOid = new ObjectId(itemId);
    const commentOid = new ObjectId(commentId);
    await Commenting.assertCommenterIsUser(itemOid, commentOid, user);
    return await Commenting.editComment(itemOid, commentOid, comment);
  }

  @Router.delete("/items/:itemId/comments/:commentId")
  async deleteComment(session: SessionDoc, itemId: ObjectId, commentId: string) {
    const user = Sessioning.getUser(session);
    const itemOid = new ObjectId(itemId);
    const commentOid = new ObjectId(commentId);
    await Commenting.assertCommenterIsUser(itemOid, commentOid, user);
    return Commenting.delete(itemOid, commentOid);
  }

  //////////////////////////////////// claiming ////////////////////////////////////
  @Router.get("/items/:itemId/position")
  async getQueuePosition(session: SessionDoc, itemId: string) {
    const user = Sessioning.getUser(session);
    const itemOid = new ObjectId(itemId);
    const position = await Selling.getQueuePosition(itemOid, user);
    if (position == 0) {
      return { msg: "You are not on the queue for the item." };
    }
    return { msg: "You are on the queue for the item.", position: position };
  }

  @Router.get("/items/:itemId/queue")
  async getItemQueue(itemId: string) {
    const itemOid = new ObjectId(itemId);
    const queue = await Selling.getItemQueue(itemOid);
    return Responses.queues(queue);
  }

  @Router.patch("/items/:itemId/claim")
  async claimItem(session: SessionDoc, itemId: string) {
    const user = Sessioning.getUser(session);
    const itemOid = new ObjectId(itemId);
    await Selling.claimItem(itemOid, user);
    return { msg: "" };
  }

  @Router.patch("/items/:itemId/unclaim")
  async unclaimItem(session: SessionDoc, itemId: string) {
    const user = Sessioning.getUser(session);
    const itemOid = new ObjectId(itemId);
    await Selling.unclaimItem(itemOid, user);
    return { msg: "" };
  }

  //////////////////////////////////// rating ////////////////////////////////////
  @Router.get("/ratings")
  async getRating(seller: string) {
    const sellerOid = new ObjectId(seller);
    const rating = await Rating.getRating(sellerOid);
    if (rating == 0) {
      return { msg: "seller doesn't have any ratings yet." };
    }
    return { msg: "Here is the seller's average rating.", rating: rating };
  }

  @Router.post("/ratings/:itemId")
  async rate(session: SessionDoc, seller: string, item: string, rating: number) {
    const user = Sessioning.getUser(session);
    const sellerOid = new ObjectId(seller);
    const itemOid = new ObjectId(item);
    const ratingGiven = await Rating.rate(sellerOid, itemOid, user, rating);
    return { msg: "The seller has been rated for this item.", rating: ratingGiven };
  }

  @Router.patch("/ratings/:itemId")
  async changeRating(session: SessionDoc, seller: string, item: string, rating: number) {
    const user = Sessioning.getUser(session);
    const sellerOid = new ObjectId(seller);
    const itemOid = new ObjectId(item);
    await Rating.assertRaterIsUser(user, sellerOid, itemOid);
    await Rating.changeRating(sellerOid, itemOid, user, rating);
    return { msg: "The rating has been updated." };
  }

  @Router.post('/openai/cda')
  async generateCDAForm(prompt: string) {
    try {
      // Read and parse the Excel file
      const workbook = xlsx.readFile('server/assets/documents/ExtractedContractData.xlsx');
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      // Convert to CSV for prompt clarity
      const csvData = jsonData.map(row => (row as any[]).join(',')).join('\n');
      // Compose the full prompt
      const fullPrompt = `${prompt}\n\nHere is the extracted spreadsheet data from the transaction (as CSV):\n${csvData}`;
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 1200,
      });
      return { result: completion.choices[0].message.content };
    } catch (err: any) {
      return { error: err.message || 'OpenAI API error.' };
    }
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
