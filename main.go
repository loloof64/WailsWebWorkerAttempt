package main

import (
	"io/ioutil"

	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

func readPgn() string {
	file, err := ioutil.ReadFile("Andersson.pgn")

	if err != nil {
		return "Error while reading file !"
	}

	return string(file)
}

func main() {

	js := mewn.String("./frontend/dist/app.js")
	css := mewn.String("./frontend/dist/app.css")

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height: 768,
		Title:  "WailsWebWorkerAttempt",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})
	app.Bind(readPgn)
	app.Run()
}
