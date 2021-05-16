import { getApi } from "./axios";
import AuthApi from "./auth";
import UserApi from './users';
import CoursesApi from './courses';

class Apis {
    /**
     *
     *
     * @param {*} token
     * @memberof Apis
     */
    initialize(token) {
        this.token = token
        this.api = getApi(this.token)

        this.authApi = new AuthApi(this.api)
        this.userApi = new UserApi(this.api)
        this.CoursesApi = new CoursesApi(this.api)

    }
}

let apis = new Apis();
export default apis;
