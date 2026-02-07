
const uFetch = require('./src/fetch');
const assert = require('assert');

// Mock specific global fetch for testing
global.fetch = async (url, options) => {
    return {
        url,
        options,
        status: 200,
        json: async () => ({ success: true })
    };
};

async function test() {
    console.log("Starting verification...");
    const client = new uFetch("http://api.example.com");

    // 1. Header Normalization (Map, Headers, Object)
    console.log("Test 1: Header Normalization");
    const mapHeaders = new Map();
    mapHeaders.set("X-Map", "true");

    // Polyfill Headers for node environment if not present (Node 18+ has it, but just in case)
    if (typeof Headers === 'undefined') {
        global.Headers = class Headers extends Map {
            append(k, v) { this.set(k, v); }
        }
    }
    const objHeaders = { "X-Object": "true" };

    try {
        // We can't easily inspect internal headers of the request strictly without spying on fetch
        // BUT we can check the options passed to our mock fetch.

        // request with Map
        let res = await client.GET({ headers: mapHeaders });
        assert.strictEqual(res.options.headers.get("X-Map"), "true", "Map headers failed");

        // request with Object
        res = await client.GET({ headers: objHeaders });
        assert.strictEqual(res.options.headers.get("X-Object"), "true", "Object headers failed");

        console.log("  ✅ Headers normalized correctly");
    } catch (e) {
        console.error("  ❌ Headers test failed", e);
        process.exit(1);
    }

    // 2. Content-Type for String
    console.log("Test 2: Content-Type for String");
    try {
        const textData = "some raw text";
        const res = await client.POST({ data: textData });

        // Should NOT have application/json
        assert.ok(!res.options.headers.has("Content-Type"), "Should not have Content-Type for string by default");
        assert.strictEqual(res.options.body, textData, "Body should be passed as is");

        // Object data
        const jsonData = { foo: "bar" };
        const res2 = await client.POST({ data: jsonData });
        assert.strictEqual(res2.options.headers.get("Content-Type"), "application/json", "Should have Content-Type for object");

        console.log("  ✅ Content-Type logic correct");
    } catch (e) {
        console.error("  ❌ Content-Type test failed", e);
        process.exit(1);
    }

    // 3. URL Construction
    console.log("Test 3: URL Construction");
    try {
        // Base params
        const data = { page: "1", sort: "desc" };
        const res = await client.GET({ url: "http://api.example.com/items", data });

        const urlObj = new URL(res.url);
        assert.strictEqual(urlObj.searchParams.get("page"), "1");
        assert.strictEqual(urlObj.searchParams.get("sort"), "desc");

        // Existing params in URL
        const res2 = await client.GET({ url: "http://api.example.com/items?filter=active", data });
        const urlObj2 = new URL(res2.url);
        assert.strictEqual(urlObj2.searchParams.get("filter"), "active");
        assert.strictEqual(urlObj2.searchParams.get("page"), "1");

        console.log("  ✅ URL params constructed correctly");
    } catch (e) {
        console.error("  ❌ URL test failed", e);
        process.exit(1);
    }

    // 4. Method Naming & Aliases
    console.log("Test 4: Method Names");
    try {
        client.setBasicAuthorization("user", "pass");
        assert.ok(client._basic_authentication.startsWith("Basic "), "setBasicAuthorization failed");

        client.ClearAuthorizationHeader();

        client.SetBasicAuthorization("user", "pass");
        assert.ok(client._basic_authentication.startsWith("Basic "), "SetBasicAuthorization alias failed");

        console.log("  ✅ Method names and aliases work");
    } catch (e) {
        console.error("  ❌ Method names test failed", e);
        process.exit(1);
    }

    console.log("All tests passed! 🎉");
}

test();
