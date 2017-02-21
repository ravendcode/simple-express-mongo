const request = require("supertest");
const expect = require("expect");
const app = require("../../../app.js");

describe("routes/api/books.route.js", () => {
    describe("#GET /api/books", () => {
        it("should include book name C++", (done) => {
            request(app)
                .get("/api/books")
                .expect(200)
                .expect((res) => {
                    expect(res.body).toInclude({
                        name: "C++"
                    });
                })
                .end(done);
        });

        it("should return list books", (done) => {
            request(app)
                .get("/api/books")
                .expect(200)
                .expect([{
                    name: "C++"
                }, {
                    name: "PHP"
                }])
                .end(done);
        });
    });
});
