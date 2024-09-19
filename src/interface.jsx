// Define the Ticket class
export class Ticket {
    constructor(id, title, tag, userId, status, priority) {
        this.id = id;
        this.title = title;
        this.tag = tag;
        this.userId = userId;
        this.status = status;
        this.priority = priority;
    }
}

export class User {
    constructor(id, name, available) {
        this.id = id;
        this.name = name;
        this.available = available;
    }
}

export class Col {
    constructor(col) {
        this.col = col;
    }
}

// Define the UserIdToData class
export class UserIdToData {
    constructor(userData) {
        this.userData = userData;
    }
}
