function getJavaVMS() {
    const getJavaVM = async source => (await readdir(source, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
    if (process.platform === "darwin") {
        getJavaVM("/Library/Java/JavaVirtualMachines/").then((dirs) => {
            for (const dir of dirs) {
                if (dir.includes("1.8") || dir.includes("17") || dir.includes("18") || dir.includes("19")) {
                    const jvmpath = path.join("/Library/Java/JavaVirtualMachines/", dir, "/Contents/Home/bin/java")
                    javaVMS.push(jvmpath)
                    console.log(`Java Path: ${jvmpath}`)
                }
            }
        })
    }
    if (process.platform === "win32") {
        getJavaVM("C:\\Program Files (x86)\\Java").then((dirs) => {
            for (const dir of dirs) {
                if (dir.includes("1.8")) {
                    javaPath = path.join("C:\\Program Files (x86)\\Java", dir, "\\bin\\java.exe")
                    console.log(`[Lime]: Set Java Path to ${javaPath}`)
                }
            }
        }).catch((err) => {
            getJavaVM("C:\\Program Files\\Java").then((dirs) => {
                for (const dir of dirs) {
                    if (dir.includes("1.8")) {
                        javaPath = path.join("C:\\Program Files\\Java", dir, "\\bin\\java.exe")
                        console.log(`[Lime]: Set Java Path to ${javaPath}`)
                    }
                }
            })
        })
    }
}

exports.getJavaVMS = getJavaVMS