import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Entry extends mixin(Model, {
    name: Model.attribute('name'),
    image: Model.attribute('image'),
    createdAt: Model.attribute('createdAt', Model.transformDate),
    canLike: Model.attribute('canLike'),

    user: Model.hasOne('user'),
    likes: Model.hasMany('likes'),
}) {
    apiEndpoint() {
        return '/carving-contest/entries' + (this.exists ? '/' + this.data.id : '');
    }
}
