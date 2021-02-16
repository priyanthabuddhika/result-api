const sql = require("./db.js");

// constructor
const Student = function (student) {
    this.indexNo = student.indexNo;
    this.name = student.name;
    this.regNo = student.regNo;
    this.email = student.email;
    this.status = student.status;
};

Student.create = (newStudent, result) => {
    sql.query("INSERT INTO student SET ?", newStudent, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created student: ", { id: res.insertId, ...newStudent });
        result(null, { id: res.insertId, ...newStudent });
    });
};

Student.findById = (studentId, result) => {
    sql.query(`SELECT * FROM student WHERE index_no = ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found student: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Student with the id
        result({ kind: "not_found" }, null);
    });
};

Student.getAll = result => {
    sql.query("SELECT * FROM student", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("student: ", res);
        result(null, res);
    });
};

Student.updateById = (id, student, result) => {
    sql.query(
        "UPDATE student SET email = ?, name = ?, status = ? WHERE id = ?",
        [student.email, student.name, student.status, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Student with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated student: ", { id: id, ...student });
            result(null, { id: id, ...student });
        }
    );
};

Student.remove = (id, result) => {
    sql.query("DELETE FROM student WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Student with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted student with id: ", id);
        result(null, res);
    });
};

Student.removeAll = result => {
    sql.query("DELETE FROM student", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} student`);
        result(null, res);
    });
};

module.exports = Student;