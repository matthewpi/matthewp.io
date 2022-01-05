package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"gopkg.in/yaml.v2"
)

type Item[T any] struct {
	Data Data[T] `json:"data"`
}

type Array[T any] struct {
	Data []Data[T] `json:"data"`
}

type Data[T any] struct {
	ID         uint64 `json:"id"`
	Attributes T      `json:"attributes"`
}

type Article struct {
	Content     string        `json:"content,omitempty"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
	PublishedAt *time.Time    `json:"publishedAt"`
	Title       string        `json:"title"`
	Summary     string        `json:"summary"`
	Slug        string        `json:"slug"`
	Authors     Array[Author] `json:"authors"`
	Image       string        `json:"image"`
	ReadTime    string        `json:"readTime,omitempty"`
}

type Author struct {
	Name      string    `json:"name"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Avatar    string    `json:"avatar"`
	// 	Avatar    Item[Media] `json:"avatar"`
}

// type Media struct {
// 	Name            string                 `json:"name"`
// 	AlternativeText string                 `json:"alternativeText"`
// 	Caption         string                 `json:"caption"`
// 	Width           uint                   `json:"width"`
// 	Height          uint                   `json:"height"`
// 	Formats         map[string]MediaFormat `json:"formats"`
// }
//
// type MediaFormat struct {
// 	Name   string  `json:"name"`
// 	Hash   string  `json:"hash"`
// 	Ext    string  `json:"ext"`
// 	Mime   string  `json:"mime"`
// 	Width  uint    `json:"width"`
// 	Height uint    `json:"height"`
// 	Size   float64 `json:"size"`
// 	Path   *string `json:"path"`
// 	URL    string  `json:"url"`
// }

func main() {
	if err := os.RemoveAll("scripts/generated"); err != nil {
		panic(err)
		return
	}

	if err := os.Mkdir("scripts/generated", 0755); err != nil {
		panic(err)
		return
	}

	req, err := http.NewRequest("GET", "https://strapi.matthewp.io/api/articles?populate=authors&sort[0]=createdAt:desc", nil)
	if err != nil {
		panic(err)
		return
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
		return
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		b, err := io.ReadAll(res.Body)
		if err != nil {
			panic(err)
			return
		}
		fmt.Println(string(b))
		panic(res.StatusCode)
		return
	}

	var data Array[Article]
	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		panic(err)
		return
	}

	for i, a := range data.Data {
		content, err := getFileContent(a.Attributes)
		if err != nil {
			panic(err)
			return
		}
		f, err := os.OpenFile(filepath.Join("scripts", "generated", a.Attributes.Slug+".mdx"), os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
		if err != nil {
			panic(err)
			return
		}
		if _, err := f.Write(content); err != nil {
			fmt.Printf("failed to write to file: %v\n", err)
			os.Exit(1)
			return
		}
		_ = f.Close()

		data.Data[i].Attributes.Content = ""
	}

	f, err := os.OpenFile("scripts/generated/articles.json", os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
		return
	}
	if err := json.NewEncoder(f).Encode(data); err != nil {
		panic(err)
		return
	}
	_ = f.Close()
}

type Metadata struct {
	Slug        string           `yaml:"slug"`
	Title       string           `yaml:"title"`
	Summary     string           `yaml:"summary"`
	Image       string           `yaml:"image"`
	PublishedAt time.Time        `yaml:"publishedAt"`
	UpdatedAt   time.Time        `yaml:"updatedAt"`
	ReadTime    string           `yaml:"readTime,omitempty"`
	Authors     []MetadataAuthor `yaml:"authors"`
}

type MetadataAuthor struct {
	Name   string `yaml:"name"`
	URL    string `yaml:"url"`
	Avatar string `yaml:"avatar"`
}

func getFileContent(article Article) ([]byte, error) {
	authors := make([]MetadataAuthor, len(article.Authors.Data))
	for i, a := range article.Authors.Data {
		authors[i] = MetadataAuthor{
			Name:   a.Attributes.Name,
			URL:    a.Attributes.URL,
			Avatar: a.Attributes.Avatar,
		}
	}

	var publishedAt time.Time
	if article.PublishedAt != nil {
		publishedAt = *article.PublishedAt
	} else {
		publishedAt = article.CreatedAt
	}

	b := &bytes.Buffer{}
	b.Write([]byte("---\n"))
	if err := yaml.NewEncoder(b).Encode(Metadata{
		Slug:        article.Slug,
		Title:       article.Title,
		Summary:     article.Summary,
		Image:       article.Image,
		PublishedAt: publishedAt,
		UpdatedAt:   article.UpdatedAt,
		ReadTime:    article.ReadTime,
		Authors:     authors,
	}); err != nil {
		return nil, err
	}
	b.Write([]byte("---\n\n"))
	b.WriteString(article.Content)

	return b.Bytes(), nil
}
