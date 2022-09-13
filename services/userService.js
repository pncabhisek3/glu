import React, { Component } from 'react';
import axios from 'axios';

class UserService extends Component {

    async getUsers(url) {
        console.log("get users..");
        return await axios.get(url);
    }

}

export default UserService;