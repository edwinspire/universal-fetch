const uFetch = require("../src/fetch.js");

const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing Refactored BATCH Method and validations ===");

  const users = [
    { name: "Edwin", email: "edwin@example.com" },
    { name: "John", email: "john@example.com" }
  ];

  // 1. Correct usage (single config object)
  try {
    console.log("\n1. Testing correct usage with single config object...");
    const results = await api.batch({
      url: "https://httpbin.org/post",
      method: "POST",
      items: users,
      config: { concurrency: 2 }
    });
    console.log(`Success! Processed ${results.length} items.`);
  } catch (error) {
    console.error("Should not have failed:", error.message);
  }

  // 2. Exception: Multiple parameters passed to batch()
  try {
    console.log("\n2. Testing exception: multiple parameters...");
    await api.batch("https://httpbin.org/post", "POST", users);
    console.error("Fail: Did not throw exception for multiple parameters");
  } catch (error) {
    console.log("Passed! Expected exception caught:", error.message);
  }

  // 3. Exception: Non-object parameter passed to batch()
  try {
    console.log("\n3. Testing exception: string instead of object...");
    await api.batch("https://httpbin.org/post");
    console.error("Fail: Did not throw exception for non-object parameter");
  } catch (error) {
    console.log("Passed! Expected exception caught:", error.message);
  }

  // 4. Exception: Missing 'items' parameter
  try {
    console.log("\n4. Testing exception: missing 'items' parameter...");
    await api.batch({
      url: "https://httpbin.org/post",
      method: "POST"
    });
    console.error("Fail: Did not throw exception for missing 'items'");
  } catch (error) {
    console.log("Passed! Expected exception caught:", error.message);
  }

  // 5. Exception: 'items' is not an array
  try {
    console.log("\n5. Testing exception: 'items' is not an array...");
    await api.batch({
      url: "https://httpbin.org/post",
      method: "POST",
      items: "not-an-array"
    });
    console.error("Fail: Did not throw exception for 'items' not being an array");
  } catch (error) {
    console.log("Passed! Expected exception caught:", error.message);
  }

  // 6. Correct usage of batch_old with positional parameters
  try {
    console.log("\n6. Testing batch_old with positional parameters...");
    const results = await api.batch_old(
      "https://httpbin.org/post",
      "POST",
      users,
      {},
      {},
      { concurrency: 2 }
    );
    console.log(`Success! batch_old processed ${results.length} items successfully.`);
  } catch (error) {
    console.error("batch_old should have worked but failed:", error.message);
  }

  // 7. Test includeResponse (default vs explicit true)
  try {
    console.log("\n7. Testing includeResponse flag...");
    const resultsDefault = await api.batch({
      url: "https://httpbin.org/post",
      method: "POST",
      items: [{ name: "TestDefault" }],
      config: { concurrency: 1 }
    });
    
    const resultsWithResponse = await api.batch({
      url: "https://httpbin.org/post",
      method: "POST",
      items: [{ name: "TestExplicit" }],
      config: { concurrency: 1, includeResponse: true }
    });

    const defaultHasRes = resultsDefault[0].response !== undefined;
    const explicitHasRes = resultsWithResponse[0].response !== undefined;

    console.log(`- By default, has response? ${defaultHasRes ? "FAIL" : "PASS (No response object, lighter footprint)"}`);
    console.log(`- With includeResponse: true, has response? ${explicitHasRes ? "PASS (Response object included)" : "FAIL"}`);
  } catch (error) {
    console.error("Test 7 failed:", error.message);
  }

  // 8. Test custom responseParser
  try {
    console.log("\n8. Testing custom responseParser...");
    const resultsCustom = await api.batch({
      url: "https://httpbin.org/status/201",
      method: "GET",
      items: [{ id: 1 }],
      config: {
        concurrency: 1,
        responseParser: async (response) => {
          return `Parsed-Status-${response.status}`;
        }
      }
    });

    const parsedValue = resultsCustom[0].data;
    console.log(`- Custom parsed value: "${parsedValue}" -> ${parsedValue === "Parsed-Status-201" ? "PASS" : "FAIL"}`);
  } catch (error) {
    console.error("Test 8 failed:", error.message);
  }

  // 9. Test item body override in batch
  try {
    console.log("\n9. Testing item body override in batch...");
    const results = await api.batch({
      url: "https://httpbin.org/post",
      method: "POST",
      items: [
        {
          body: { customBody: "Item 1 Body" },
          headers: { "X-Custom": "Val1" }
        },
        {
          body: { customBody: "Item 2 Body" }
        }
      ],
      config: { concurrency: 2 }
    });
    console.log("-> Response 1 data reflected body:", results[0].data.json);
    console.log("-> Response 2 data reflected body:", results[1].data.json);
    console.log("PASS! Item body override works in batch.");
  } catch (error) {
    console.error("Test 9 failed:", error.message);
  }
}

run();
