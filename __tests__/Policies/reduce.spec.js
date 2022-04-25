"use strict";

const Policies = require("../../lib/Policies");

describe("for mode=merge", () => {
  describe("given one policy and one nullish policy", () => {
    it("should return the defined policy", () => {
      const policy1 = {
        mode: "merge",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const policy2 = undefined;

      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given emtpy policies", () => {
    it("should return an empty object", () => {
      const policy1 = { mode: "merge" };
      const policy2 = { mode: "merge" };
      const expected = { directives: {} };
      const result = Policies.reduce(policy1, policy2);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("given one policy", () => {
    it("should return that policy", () => {
      const policy1 = {
        mode: "merge",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };

      const result = Policies.reduce(policy1);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given two policies", () => {
    it("should merge policy2 on top of policy1", () => {
      const policy1 = {
        mode: "merge",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const policy2 = {
        mode: "merge",
        directives: {
          "default-src": ["https://policy2-default-2.com"],
          "img-src": ["https://policy2-img.com"],
          "object-src": ["https://policy2-object.com"],
        },
      };
      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
            "https://policy2-default-2.com",
          ],
          "img-src": ["https://policy1-img.com", "https://policy2-img.com"],
          "object-src": ["https://policy2-object.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given three policies", () => {
    it("should merge 3 => 2 => 1", () => {
      const policy1 = {
        mode: "merge",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img-1.com"],
        },
      };
      const policy2 = {
        mode: "merge",
        directives: {
          "default-src": ["https://policy2-default-1.com"],
          "img-src": ["https://policy2-img-1.com"],
          "object-src": ["https://policy2-object-1.com"],
        },
      };
      const policy3 = {
        mode: "merge",
        directives: {
          "default-src": ["https://policy3-default-1.com"],
          "img-src": ["https://policy3-img-1.com"],
          "object-src": ["https://policy3-object-1.com"],
        },
      };

      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
            "https://policy2-default-1.com",
            "https://policy3-default-1.com",
          ],
          "img-src": [
            "https://policy1-img-1.com",
            "https://policy2-img-1.com",
            "https://policy3-img-1.com",
          ],
          "object-src": [
            "https://policy2-object-1.com",
            "https://policy3-object-1.com",
          ],
        },
      };

      const result = Policies.reduce(policy1, policy2, policy3);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given one policy and one nullish policy", () => {
    it("should return the defined policy", () => {
      const policy1 = {
        mode: "merge",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const policy2 = undefined;

      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });
  });
});

describe("for mode=replace", () => {
  describe("given one policy and one nullish policy", () => {
    it("should return the defined policy", () => {
      const policy1 = {
        mode: "replace",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const policy2 = undefined;

      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given emtpy policies", () => {
    it("should return an empty object", () => {
      const policy1 = { mode: "replace" };
      const policy2 = { mode: "replace" };
      const expected = {};
      const result = Policies.reduce(policy1, policy2);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("given one policy", () => {
    it("should return that policy", () => {
      const policy1 = {
        mode: "replace",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const expected = {
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };

      const result = Policies.reduce(policy1);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given two policies", () => {
    it("should replace policy1's policies with policy2's", () => {
      const policy1 = {
        mode: "replace",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img.com"],
        },
      };
      const policy2 = {
        mode: "replace",
        directives: {
          "default-src": ["https://policy2-default-2.com"],
          "img-src": ["https://policy2-img.com"],
          "object-src": ["https://policy2-object.com"],
        },
      };
      const expected = {
        directives: {
          "default-src": ["https://policy2-default-2.com"],
          "img-src": ["https://policy2-img.com"],
          "object-src": ["https://policy2-object.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });

    it("should replace keys that don't collide", () => {
      const policy1 = {
        mode: "replace",
        directives: {
          "default-src": ["https://policy1-default-1.com"],
          "img-src": ["https://policy1-img-1.com"],
        },
      };
      const policy2 = {
        mode: "replace",
        directives: {
          "default-src": ["https://policy2-default-2.com"],
        },
      };
      const expected = {
        directives: {
          "default-src": ["https://policy2-default-2.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("given three policies", () => {
    it("should replace 3 ==[replace]=> 2 ==[replace]=> 1", () => {
      const policy1 = {
        mode: "replace",
        directives: {
          "default-src": [
            "https://policy1-default-1.com",
            "https://policy1-default-2.com",
          ],
          "img-src": ["https://policy1-img-1.com"],
        },
      };
      const policy2 = {
        mode: "replace",
        directives: {
          "default-src": ["https://policy2-default-1.com"],
          "img-src": ["https://policy2-img-1.com"],
          "object-src": ["https://policy2-object-1.com"],
        },
      };
      const policy3 = {
        mode: "replace",
        directives: {
          "default-src": ["https://policy3-default-1.com"],
          "object-src": ["https://policy3-object-1.com"],
        },
      };

      const expected = {
        directives: {
          "default-src": ["https://policy3-default-1.com"],
          "object-src": ["https://policy3-object-1.com"],
        },
      };

      const result = Policies.reduce(policy1, policy2, policy3);

      expect(result).toStrictEqual(expected);
    });
  });
});

describe("for mixed mode=merge|replace", () => {
  describe("given emtpy policies", () => {
    it("should return an empty object", () => {
      const policy1 = { mode: "replace" };
      const policy2 = { mode: "merge" };
      const expected = { directives: {} };
      const result = Policies.reduce(policy1, policy2);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("given two policies", () => {
    describe("policy1=merge, policy2=replace", () => {
      it("should replace policy1's policies with policy2's", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img.com"],
          },
        };
        const policy2 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy2-default-2.com"],
            "img-src": ["https://policy2-img.com"],
            "object-src": ["https://policy2-object.com"],
          },
        };
        const expected = {
          directives: {
            "default-src": ["https://policy2-default-2.com"],
            "img-src": ["https://policy2-img.com"],
            "object-src": ["https://policy2-object.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2);

        expect(result).toStrictEqual(expected);
      });

      it("should not replace keys that don't collide", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": ["https://policy1-default-1.com"],
            "img-src": ["https://policy1-img-1.com"],
          },
        };
        const policy2 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy2-default-2.com"],
          },
        };
        const expected = {
          directives: {
            "default-src": ["https://policy2-default-2.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("policy1=replace, policy2=merge", () => {
      it("should merge policy2's policies with policy1's", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img.com"],
          },
        };
        const policy2 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy2-default-2.com"],
            "img-src": ["https://policy2-img.com"],
            "object-src": ["https://policy2-object.com"],
          },
        };
        const expected = {
          directives: {
            "default-src": ["https://policy2-default-2.com"],
            "img-src": ["https://policy2-img.com"],
            "object-src": ["https://policy2-object.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2);

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("given three policies", () => {
    describe("policy1=merge, policy2=replace, policy3=merge", () => {
      it("should: 3 ==[merge]=> 2 ==[replace]=> 1", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img-1.com"],
          },
        };
        const policy2 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy2-default-1.com"],
            "img-src": ["https://policy2-img-1.com"],
            "object-src": ["https://policy2-object-1.com"],
          },
        };
        const policy3 = {
          mode: "merge",
          directives: {
            "default-src": ["https://policy3-default-1.com"],
            "object-src": ["https://policy3-object-1.com"],
          },
        };

        const expected = {
          directives: {
            "default-src": [
              "https://policy2-default-1.com",
              "https://policy3-default-1.com",
            ],
            "img-src": ["https://policy2-img-1.com"],
            "object-src": [
              "https://policy2-object-1.com",
              "https://policy3-object-1.com",
            ],
          },
        };

        const result = Policies.reduce(policy1, policy2, policy3);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("policy1=merge, policy2=merge, policy3=replace", () => {
      it("should: 3 ==[replace]=> 2 ==[replace]=> 1", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img-1.com"],
          },
        };
        const policy2 = {
          mode: "merge",
          directives: {
            "default-src": ["https://policy2-default-1.com"],
            "img-src": ["https://policy2-img-1.com"],
            "object-src": ["https://policy2-object-1.com"],
          },
        };
        const policy3 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy3-default-1.com"],
            "object-src": ["https://policy3-object-1.com"],
          },
        };

        const expected = {
          directives: {
            "default-src": ["https://policy3-default-1.com"],
            "object-src": ["https://policy3-object-1.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2, policy3);

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("given four policies", () => {
    describe("some nullish, some not", () => {
      it("should ignore the nullish, and apply the defined", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img-1.com"],
          },
        };
        const policy2 = undefined;
        const policy3 = null;

        const policy4 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy4-default-1.com"],
            "img-src": ["https://policy3-object-1.com"],
          },
        };

        const expected = {
          directives: {
            "default-src": ["https://policy4-default-1.com"],
            "img-src": ["https://policy3-object-1.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2, policy3, policy4);

        expect(result).toStrictEqual(expected);
      });
    });
    describe("policy1=merge, policy2=replace, policy3=merge, policy4=replace", () => {
      it("should: 4 ==[replace]=> 3 ==[replace]=> 2 ==[replace]=> 1", () => {
        const policy1 = {
          mode: "merge",
          directives: {
            "default-src": [
              "https://policy1-default-1.com",
              "https://policy1-default-2.com",
            ],
            "img-src": ["https://policy1-img-1.com"],
          },
        };
        const policy2 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy2-default-1.com"],
            "img-src": ["https://policy2-img-1.com"],
            "object-src": ["https://policy2-object-1.com"],
          },
        };
        const policy3 = {
          mode: "merge",
          directives: {
            "default-src": ["https://policy3-default-1.com"],
            "object-src": ["https://policy3-object-1.com"],
          },
        };

        const policy4 = {
          mode: "replace",
          directives: {
            "default-src": ["https://policy4-default-1.com"],
            "img-src": ["https://policy4-img-1.com"],
          },
        };

        const expected = {
          directives: {
            "default-src": ["https://policy4-default-1.com"],
            "img-src": ["https://policy4-img-1.com"],
          },
        };

        const result = Policies.reduce(policy1, policy2, policy3, policy4);

        expect(result).toStrictEqual(expected);
      });
    });
  });
});

describe("given nullish policies", () => {
  it("should return { directives: {} } for undefined", () => {
    const policy1 = undefined;
    const policy2 = undefined;
    const expected = {};
    const result = Policies.reduce(policy1, policy2);
    expect(result).toStrictEqual(expected);
  });

  it("should return an empty object for null", () => {
    const policy1 = null;
    const policy2 = null;
    const expected = {};
    const result = Policies.reduce(policy1, policy2);
    expect(result).toStrictEqual(expected);
  });
});

describe("given no policies", () => {
  it("should return an empty object", () => {
    const expected = {};
    const result = Policies.reduce();
    expect(result).toStrictEqual(expected);
  });
});
