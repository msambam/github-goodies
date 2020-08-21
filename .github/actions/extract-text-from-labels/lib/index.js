"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('github-token', { required: true });
            const pattern = core.getInput('pattern', { required: true });
            const group = core.getInput('group', { required: true });
            const labels = yield listLabelsOnIssue(token);
            let substrings = extractTextFromLabels(labels, new RegExp(pattern), Number(group));
            core.setOutput("substrings", substrings);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function listLabelsOnIssue(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let client = github.getOctokit(token);
        const opts = client.issues.listLabelsOnIssue.endpoint.merge(Object.assign(Object.assign({}, github.context.repo), { issue_number: github.context.issue.number }));
        return yield client.paginate(opts);
    });
}
function extractTextFromLabels(labels, pattern, index) {
    let substrings = [];
    for (const label of labels) {
        var match = label.name.match(pattern);
        if (match && index <= match.length - 1 && substrings.findIndex(match[index]) > 0) {
            substrings.push(match[index]);
        }
    }
    return substrings;
}
run();
