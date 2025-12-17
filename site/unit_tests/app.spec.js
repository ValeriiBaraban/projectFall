describe('Check input field', () => {
        it('return [] when field is empty', () => {
        const result = window.inputSearch(["Seattle", "Shoreline"]);

        expect(result.find('')).toEqual([]);

    });
})

describe("inputSearch", () => {
  it("returns matches in list", () => {
    const search = window.inputSearch(["Seattle", "Shoreline", "Tacoma"]);
    expect(search.find("s")).toEqual(["Seattle", "Shoreline"]);
    expect(search.find("SE")).toEqual(["Seattle"]);
  });
});
