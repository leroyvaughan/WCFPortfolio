<%@ Page Title="" Language="C#" MasterPageFile="~/Portfolio.master" AutoEventWireup="true" CodeFile="wcfPortfolio.aspx.cs" Inherits="portfolio_wcfPortfolio" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" Runat="Server">
    <ul class="list">
        <li id="{{p.ID}}" ng-repeat="p in allData | orderBy:['-Year', '-Company'] | filter:subCatsFilter" class="ng-scope">
            <p class="title">{{p.Title}}</p>
            <div class="desc">
                <div style="text-align:left;font-weight:bold;margin:0 15px 8px 0;">{{p.Company}} : {{p.Year}}</div>
                {{p.Description}}
            </div>
            <div ng-switch="" on="isBlank(p.Link)">
                <div ng-switch-when="blank">
                    <img ng-src="/portfolio/images/{{imgPath}}/{{p.ImgSource}}" />
                </div>
                <div ng-switch-default="">
                    <a href="{{p.Link}}" target="_blank">
                        <img ng-src="/portfolio/images/{{imgPath}}/{{p.ImgSource}}" /></a>
                </div>
            </div>
            <div class="topLink">
                <a href="#ng-app">back to top</a></div>
        </li>
    </ul>
</asp:Content>