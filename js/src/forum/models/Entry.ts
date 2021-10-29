import Model from 'flarum/common/Model';
import User from 'flarum/common/models/User';

export default class Entry extends Model {
    name = Model.attribute('name');
    image = Model.attribute('image');
    createdAt = Model.attribute('createdAt', Model.transformDate);
    canLike = Model.attribute('canLike');

    user = Model.hasOne('user') as any as (() => User);
    likes = Model.hasMany('likes') as any as (() => User[] | false);

    apiEndpoint() {
        // @ts-ignore Flarum typings do not include .id
        return '/carving-contest/entries' + (this.exists ? '/' + this.data.id : '');
    }
}
