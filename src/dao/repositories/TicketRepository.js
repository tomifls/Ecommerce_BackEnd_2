import { TicketModel } from "../models/Ticket.model.js";

export class TicketRepository {
    async createTicket(ticketData) {
        return await TicketModel.create(ticketData);
    }
}