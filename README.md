# micro-test-request

Will call your [micro](https://github.com/zeit/micro) function with a fake `req` and `res`.

```javascript
const request = require("@orikami/micro-test-request");

// Your micro function in `index.js`
const handler = (req, res) => {
    return "Hello world!";
}

// Test using `jest` like this:
test("200 default",async () => {
    const res = await request({
        method: "GET",
        url: "/dev/time",
        headers: {
            "authorization": "Bearer OK"
        },
        body: { hello: "world" },
        handler: handler
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers).toMatchSnapshot();
    expect(res.body).toMatchSnapshot();
});

// You can also use the fake response and request directly
const { createRequest, createResponse } = require("micro-test-request");
```
