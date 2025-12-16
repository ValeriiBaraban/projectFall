describe('Check input field', () => {
        it('return [] when field is empty', () => {
        const result = window.inputSearch(['S', 'Sa']);

        expect(result.find('')).toEqual([]);

    });
})

describe("inputSearch", () => {
  it("returns matches", () => {
    const search = window.inputSearch(["Seattle", "Shoreline", "Tacoma"]);
    expect(search.find("s")).toEqual(["Seattle", "Shoreline"]);
    expect(search.find("SE")).toEqual(["Seattle"]);
  });


});
