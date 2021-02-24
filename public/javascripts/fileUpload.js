FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 300 / 300,
    imageResizeTargetWidth: 500,
    imageResizeTargetHeight: 500
})

FilePond.parse(document.body);