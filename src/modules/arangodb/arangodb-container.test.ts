import { jest } from "@jest/globals";
import { Database } from "arangojs";
import { ArangoDBContainer } from "./arangodb-container.js";

describe("ArangoDB", () => {
  jest.setTimeout(180_000);

  it("should connect", async () => {
    const container = await new ArangoDBContainer().start();
    const db = new Database({ url: container.getHttpUrl() });

    db.database("_system");
    db.useBasicAuth(container.getUsername(), container.getPassword());

    const value = "Hello ArangoDB!";
    const result = await db.query({
      query: "RETURN @value",
      bindVars: { value },
    });
    const returnValue = await result.next();
    expect(returnValue).toBe(value);

    await container.stop();
  });
});
