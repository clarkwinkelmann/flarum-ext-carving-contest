import Mithril from 'mithril';

declare global {
    const m: Mithril.Static;
}

import User from 'flarum/common/models/User';

declare module 'flarum/forum/ForumApplication' {
    export default interface ForumApplication {
        route: {
            user(user: User): string,
        }
    }
}
