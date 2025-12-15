describe('Check input field', () => {
        it('fail when field is empty', () => {
            cityField.value = '';

        const result = checkingFieldName();

        expect(result).toBeFalse();

    });
})