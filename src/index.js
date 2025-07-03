const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const editor = new Editor({
   el: document.querySelector('#editor'),
   plugins: [tableMergedCell],
});
