import Parse from "parse";

export const getAllLessons = () => {
    const Lesson = Parse.Object.extend("Lesson");
    const query = new Parse.Query(Lesson)
    return query.find().then((results) => {
        return results;
    });
    }
