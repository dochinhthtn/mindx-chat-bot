export default class Model {
    static collection = '';
    static hiddenFields = [];
    id = null;
    ref = null;

    /**
     * Convert cloud firestore document to model
     * @param {DocumentSnapshot} doc 
     * @returns {Model}
     */
    static makeFromDoc(doc) {
        let model = new this();

        model.ref = doc.ref;
        model.id = doc.id;
        let data = doc.data();
        for (let field in data) {
            model[field] = data[field];
        }

        for (let field of this.hiddenFields) {
            delete model[field];
        }

        return model;
    }

    /**
     * Find model by id
     * @param {String} id 
     * @returns {Model|null}
     */
    static async find(id) {
        let doc = await firebase.firestore().collection(this.collection).doc(id).get();
        if (doc.exists) {
            return this.makeFromDoc(doc);
        }

        return null;
    }

    /**
     * Get multiple models with condition
     * @param {Array<['field', 'operator', 'value']>} conditions
     * @returns {Array}
     */
    static async where(conditions) {
        let result = firebase.firestore().collection(this.collection);
        for (let condition of conditions) {
            result = result.where(condition[0], condition[1], condition[2]);
        }

        let { docs } = await result.get();

        return docs.map((doc) => {
            return this.makeFromDoc(doc);
        });
    }

    /**
     * Create model from data
     * @param {Object} data
     * @returns {Model}
     */
    static async create(data) {
        let result = await firebase.firestore().collection(this.collection).add(data);
        let doc = await result.get();
        return this.makeFromDoc(doc);
    }

    async update(data) {
        await this.ref.update(data);

        for(let field in data) {
            this[field] = data[field];
        }
    }

    async delete() {
        await this.ref.delete();
    }

    /**
     * Listen on database change with conditions
     * @param {Array<['field', 'operator', 'value']>} conditions
     * @param {CallableFunction} callback
     * @returns {Array}
     */
    static onSnapshot(conditions, callback) {
        let result = firebase.firestore().collection(this.collection);
        for (let condition of conditions) {
            result = result.where(condition[0], condition[1], condition[2]);
        }

        return result.onSnapshot(({ docs }) => {
            let data = docs.map(doc => this.makeFromDoc(doc));
            callback(data);
        });
    }

    toJSON() {
        let data = { ...this };
        delete data.ref;
        return data;
    }


    onSnapshot(callback) {
        return this.ref.onSnapshot((doc) => {
            callback(doc.data());
        });
    }
}