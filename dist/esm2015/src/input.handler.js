import { InputService } from "./input.service";
export class InputHandler {
    constructor(htmlInputElement, options) {
        this.inputService = new InputService(htmlInputElement, options);
    }
    handleCut(event) {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 0);
    }
    handleInput(event) {
        let selectionStart = this.inputService.inputSelection.selectionStart;
        let keyCode = this.inputService.rawValue.charCodeAt(selectionStart - 1);
        let rawValueLength = this.inputService.rawValue.length;
        let storedRawValueLength = this.inputService.storedRawValue.length;
        if (Math.abs(rawValueLength - storedRawValueLength) != 1) {
            this.inputService.updateFieldValue(selectionStart);
            this.onModelChange(this.inputService.value);
            return;
        }
        // Restore the old value.
        this.inputService.rawValue = this.inputService.storedRawValue;
        if (rawValueLength < storedRawValueLength) {
            // Chrome Android seems to move the cursor in response to a backspace AFTER processing the
            // input event, so we need to wrap this in a timeout.
            this.timer(() => {
                // Move the cursor to just after the deleted value.
                this.inputService.updateFieldValue(selectionStart + 1);
                // Then backspace it.
                this.inputService.removeNumber(8);
                this.onModelChange(this.inputService.value);
            }, 0);
        }
        if (rawValueLength > storedRawValueLength) {
            // Move the cursor to just before the new value.
            this.inputService.updateFieldValue(selectionStart - 1);
            // Process the character like a keypress.
            this.handleKeypressImpl(keyCode);
        }
    }
    handleKeydown(event) {
        let keyCode = event.which || event.charCode || event.keyCode;
        if (keyCode == 8 || keyCode == 46 || keyCode == 63272) {
            event.preventDefault();
            if (this.inputService.inputSelection.selectionStart <= this.inputService.prefixLength() &&
                this.inputService.inputSelection.selectionEnd >= this.inputService.rawValue.length - this.inputService.suffixLength()) {
                this.clearValue();
            }
            else {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
        }
    }
    clearValue() {
        this.setValue(this.inputService.isNullable() ? null : 0);
        this.onModelChange(this.inputService.value);
    }
    handleKeypress(event) {
        let keyCode = event.which || event.charCode || event.keyCode;
        event.preventDefault();
        if (keyCode === 97 && event.ctrlKey) {
            return;
        }
        this.handleKeypressImpl(keyCode);
    }
    handleKeypressImpl(keyCode) {
        switch (keyCode) {
            case undefined:
            case 9:
            case 13:
                return;
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (this.inputService.canInputMoreNumbers) {
                    let selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart);
                    if (selectionRangeLength == this.inputService.rawValue.length) {
                        this.setValue(null);
                    }
                    this.inputService.addNumber(keyCode);
                }
                break;
        }
        this.onModelChange(this.inputService.value);
    }
    handlePaste(event) {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 1);
    }
    updateOptions(options) {
        this.inputService.updateOptions(options);
    }
    getOnModelChange() {
        return this.onModelChange;
    }
    setOnModelChange(callbackFunction) {
        this.onModelChange = callbackFunction;
    }
    getOnModelTouched() {
        return this.onModelTouched;
    }
    setOnModelTouched(callbackFunction) {
        this.onModelTouched = callbackFunction;
    }
    setValue(value) {
        this.inputService.value = value;
    }
    /**
     * Passthrough to setTimeout that can be stubbed out in tests.
     */
    timer(callback, delayMillis) {
        setTimeout(callback, delayMillis);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jdXJyZW5jeS8iLCJzb3VyY2VzIjpbInNyYy9pbnB1dC5oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxNQUFNLE9BQU8sWUFBWTtJQU1yQixZQUFZLGdCQUFrQyxFQUFFLE9BQVk7UUFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQVU7UUFDaEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNWLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVTtRQUNsQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7UUFDckUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDdkQsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFFbkUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxJQUFJ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QWEsQ0FBQyxPQUFZO1FBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVELGdCQUFnQixDQUFDLGdCQUEwQjtRQUN2QyxJQUFJLENBQUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0lBQzFDLENBQUM7SUFFRCxpQkFBaUI7UUFDYixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVELGlCQUFpQixDQUFDLGdCQUEwQjtRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYTtRQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssS0FBSyxDQUFDLFFBQW9CLEVBQUUsV0FBbUI7UUFDbkQsVUFBVSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lucHV0U2VydmljZX0gZnJvbSBcIi4vaW5wdXQuc2VydmljZVwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRIYW5kbGVyIHtcblxuICAgIHByaXZhdGUgaW5wdXRTZXJ2aWNlOiBJbnB1dFNlcnZpY2U7XG4gICAgcHJpdmF0ZSBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbjtcbiAgICBwcml2YXRlIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKGh0bWxJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIG9wdGlvbnM6IGFueSkge1xuICAgICAgICB0aGlzLmlucHV0U2VydmljZSA9IG5ldyBJbnB1dFNlcnZpY2UoaHRtbElucHV0RWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaGFuZGxlQ3V0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKCk7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIGhhbmRsZUlucHV0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIGxldCBrZXlDb2RlID0gdGhpcy5pbnB1dFNlcnZpY2UucmF3VmFsdWUuY2hhckNvZGVBdChzZWxlY3Rpb25TdGFydCAtIDEpO1xuICAgICAgICBsZXQgcmF3VmFsdWVMZW5ndGggPSB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZS5sZW5ndGg7XG4gICAgICAgIGxldCBzdG9yZWRSYXdWYWx1ZUxlbmd0aCA9IHRoaXMuaW5wdXRTZXJ2aWNlLnN0b3JlZFJhd1ZhbHVlLmxlbmd0aDtcblxuICAgICAgICBpZiAoTWF0aC5hYnMocmF3VmFsdWVMZW5ndGggLSBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkgIT0gMSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgb2xkIHZhbHVlLlxuICAgICAgICB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZSA9IHRoaXMuaW5wdXRTZXJ2aWNlLnN0b3JlZFJhd1ZhbHVlO1xuXG4gICAgICAgIGlmIChyYXdWYWx1ZUxlbmd0aCA8IHN0b3JlZFJhd1ZhbHVlTGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBDaHJvbWUgQW5kcm9pZCBzZWVtcyB0byBtb3ZlIHRoZSBjdXJzb3IgaW4gcmVzcG9uc2UgdG8gYSBiYWNrc3BhY2UgQUZURVIgcHJvY2Vzc2luZyB0aGVcbiAgICAgICAgICAgIC8vIGlucHV0IGV2ZW50LCBzbyB3ZSBuZWVkIHRvIHdyYXAgdGhpcyBpbiBhIHRpbWVvdXQuXG4gICAgICAgICAgICB0aGlzLnRpbWVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBNb3ZlIHRoZSBjdXJzb3IgdG8ganVzdCBhZnRlciB0aGUgZGVsZXRlZCB2YWx1ZS5cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0ICsgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGVuIGJhY2tzcGFjZSBpdC5cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS5yZW1vdmVOdW1iZXIoOCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTsgIFxuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmF3VmFsdWVMZW5ndGggPiBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkge1xuICAgICAgICAgICAgLy8gTW92ZSB0aGUgY3Vyc29yIHRvIGp1c3QgYmVmb3JlIHRoZSBuZXcgdmFsdWUuXG4gICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0IC0gMSk7XG5cbiAgICAgICAgICAgIC8vIFByb2Nlc3MgdGhlIGNoYXJhY3RlciBsaWtlIGEga2V5cHJlc3MuXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUtleXByZXNzSW1wbChrZXlDb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUtleWRvd24oZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQga2V5Q29kZSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICAgIGlmIChrZXlDb2RlID09IDggfHwga2V5Q29kZSA9PSA0NiB8fCBrZXlDb2RlID09IDYzMjcyKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQgPD0gdGhpcy5pbnB1dFNlcnZpY2UucHJlZml4TGVuZ3RoKCkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQgPj0gdGhpcy5pbnB1dFNlcnZpY2UucmF3VmFsdWUubGVuZ3RoIC0gdGhpcy5pbnB1dFNlcnZpY2Uuc3VmZml4TGVuZ3RoKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UucmVtb3ZlTnVtYmVyKGtleUNvZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclZhbHVlKCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuaW5wdXRTZXJ2aWNlLmlzTnVsbGFibGUoKSA/IG51bGwgOiAwKTtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcbiAgICB9XG5cbiAgICBoYW5kbGVLZXlwcmVzcyhldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGtleUNvZGUgPT09IDk3ICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5cHJlc3NJbXBsKGtleUNvZGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlS2V5cHJlc3NJbXBsKGtleUNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlIDQzOlxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLmNoYW5nZVRvUG9zaXRpdmUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDU6XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuY2hhbmdlVG9OZWdhdGl2ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dFNlcnZpY2UuY2FuSW5wdXRNb3JlTnVtYmVycykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uUmFuZ2VMZW5ndGggPSBNYXRoLmFicyh0aGlzLmlucHV0U2VydmljZS5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQgLSB0aGlzLmlucHV0U2VydmljZS5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvblJhbmdlTGVuZ3RoID09IHRoaXMuaW5wdXRTZXJ2aWNlLnJhd1ZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLmFkZE51bWJlcihrZXlDb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xuICAgIH1cblxuICAgIGhhbmRsZVBhc3RlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKCk7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIHVwZGF0ZU9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLnVwZGF0ZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0T25Nb2RlbENoYW5nZSgpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uTW9kZWxDaGFuZ2U7XG4gICAgfVxuXG4gICAgc2V0T25Nb2RlbENoYW5nZShjYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBjYWxsYmFja0Z1bmN0aW9uO1xuICAgIH1cblxuICAgIGdldE9uTW9kZWxUb3VjaGVkKCk6IEZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25Nb2RlbFRvdWNoZWQ7XG4gICAgfVxuXG4gICAgc2V0T25Nb2RlbFRvdWNoZWQoY2FsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGNhbGxiYWNrRnVuY3Rpb247XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0U2VydmljZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhc3N0aHJvdWdoIHRvIHNldFRpbWVvdXQgdGhhdCBjYW4gYmUgc3R1YmJlZCBvdXQgaW4gdGVzdHMuXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aW1lcihjYWxsYmFjazogKCkgPT4gdm9pZCwgZGVsYXlNaWxsaXM6IG51bWJlcikge1xuICAgICAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkZWxheU1pbGxpcyk7XG4gICAgfVxufVxuIl19