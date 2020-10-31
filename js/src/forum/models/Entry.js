import Model from 'flarum/Model';

export default class Entry extends Model {
    name = Model.attribute('name');
    image = Model.attribute('image');
    createdAt = Model.attribute('createdAt', Model.transformDate);
    canLike = Model.attribute('canLike');

    user = Model.hasOne('user');
    likes = Model.hasMany('likes');

    apiEndpoint() {
        return '/carving-contest/entries' + (this.exists ? '/' + this.data.id : '');
    }
}
