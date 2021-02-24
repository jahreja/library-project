FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 300 / 300,
    imageResizeTargetWidth: 300,
    imageResizeTargetHeight: 300
})

FilePond.parse(document.body);