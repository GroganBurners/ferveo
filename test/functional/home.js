module.exports = {
  // adapted from: https://git.io/vodU0
  "Grogan Burner Services Assert Title": function(browser) {
    browser
      .url("http://localhost:3000/")
      .waitForElementVisible("body")
      .assert.title("Grogan Burner Services")
      .saveScreenshot("guinea-pig-test.png")
      .end();
  }
};
