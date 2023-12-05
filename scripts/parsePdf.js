const fs = require('fs');
const pdf = require('pdf-parse');

const STARTSIGN = "中文 英文 K.K.音标"
function main() {
    let dataBuffer = fs.readFileSync('./01.pdf');

    pdf(dataBuffer).then(function (data) {
        const result = parse(data.text)
        fs.writeFileSync('./01.json',JSON.stringify(result))
    });
}

function parse(text) {
    const rawTextList = text.split('\n').map((t) => {
        return t.trim()
    })

    const startIndex = rawTextList.findIndex((t) => t === STARTSIGN)

    const textList = rawTextList.slice(startIndex + 1).filter((t) => t && !/\d/.test(Number(t)))

    const result = []

    for (let i = 0; i < textList.length; i++) {
        let data = {
            chinese: '',
            english: '',
            soundmark: ''
        }
        function run() {
            const element = textList[i]
            let chinese = ''
            let englishAndSoundmark = ''
            if (isChinese(element)) {
                chinese += element
                while (isChinese(textList[i + 1])) {
                    chinese += ","+textList[i + 1]
                    i++
                }
                data.chinese = chinese
            } else {
                englishAndSoundmark += element
                while (textList[i + 1] && !isChinese(textList[i + 1])) {
                    englishAndSoundmark += " "+textList[i + 1]
                    i++
                }

                const { english, soundmark } = parseEnglishAndSoundmark(englishAndSoundmark)
                data.english = english
                data.soundmark = soundmark
            }
        }
        run()
        i++
        run()
        result.push(data)
    }
    return result
}

function isChinese(str) {
    const chinesePattern = /^[\u4e00-\u9fa5]/;
    return chinesePattern.test(str);
}

function parseEnglishAndSoundmark(text) {
    const list = text.split(" ")
    const soundmarkStartIndex = list.findIndex((t) => t.startsWith('/'))

    const english = list.slice(0, soundmarkStartIndex).join(" ")
    const soundmark = list.slice(soundmarkStartIndex).join(" ")
    return {
        english,
        soundmark
    }
}

main()