import { createHotContext as __vite__createHotContext } from "/@vite/client"; import.meta.hot = __vite__createHotContext("/css/styles.css"); import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"
const __vite__id = "E:/Education/Linneuniversitetet/Kurser HT-22/Webbprogrammering Klient sidan/Part B/Exams/assignment-b3-pwd/src/css/styles.css"
const __vite__css = "*,*:before,*:after{\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\nimg {\r\n  max-width: 100%;\r\n  height: auto;\r\n  vertical-align: bottom;\r\n  border-style: none;\r\n}\r\n\r\nhtml{\r\n  height: calc(100vh - 16px);\r\n}\r\n\r\nbody {\r\n  height: 100%;\r\n  width: 100%;\r\n  background-color: rgb(42, 42, 42);\r\n  color:gold;\r\n  display:flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\nhr{\r\n  width:75%;\r\n  margin:0.5rem 0;\r\n  color:rgb(65, 64, 64);\r\n}\r\n\r\nmain{\r\n  background-color: inherit;\r\n  width: 75%;\r\n  height: 100%;\r\n  border: rgb(79, 79, 79) 4px inset;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: flex-start;\r\n}\r\n\r\n#appArea{\r\n  flex-grow: 1;\r\n}\r\n\r\n#bay{\r\n  height:clamp(50px, 5%, 80px);\r\n}\r\n\r\n"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
export default __vite__css
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))