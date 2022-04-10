use deltachat::constants::*;
use deltachat::{
    chat::{get_chat_contacts, ChatVisibility},
    chatlist::Chatlist,
};
use deltachat::{
    chat::{Chat, ChatId},
    message::MsgId,
};

use num_traits::cast::ToPrimitive;

use anyhow::Result;
use jsonrpc_core::serde_json::Value;
use serde::{Deserialize, Serialize};

use super::color_int_to_hex_string;
use super::return_type::*;
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
pub struct ChatListEntry(pub u32, pub u32);
impl ReturnType for ChatListEntry {
    crate::ts_rs_return_type!();
}

#[derive(Serialize)]
#[serde(tag = "type")]
pub enum ChatListItemFetchResult {
    #[serde(rename_all = "camelCase")]
    ChatListItem {
        id: u32,
        name: String,
        avatar_path: Option<String>,
        color: String,
        last_updated: Option<i64>,
        summary_text1: String,
        summary_text2: String,
        summary_status: u32,
        is_protected: bool,
        is_group: bool,
        fresh_message_counter: usize,
        is_self_talk: bool,
        is_device_talk: bool,
        is_sending_location: bool,
        is_self_in_group: bool,
        is_archived: bool,
        is_pinned: bool,
        is_muted: bool,
        is_contact_request: bool,
    },
    ArchiveLink,
    #[serde(rename_all = "camelCase")]
    Error {
        id: u32,
        error: String,
    },
}

impl ReturnType for ChatListItemFetchResult {
    fn get_typescript_type() -> String {
        "\n | { \
            type: \"ChatListItem\"; \
            id: number; \
            name: string; \
            avatarPath: null | string; \
            color: string; \
            lastUpdated: number; \
            freshMessageCounter: number; \
            summaryStatus: number; \
            summaryText1: string; \
            summaryText2: string; \
            isArchived: boolean; \
            isDeviceTalk: boolean; \
            isGroup: boolean; \
            isMuted: boolean; \
            isPinned: boolean; \
            isSelfInGroup: boolean; \
            isSelfTalk: boolean; \
            isSendingLocation: boolean; \
            isProtected: boolean; \
            isContactRequest: boolean; \
          } \
        | { type: \"ArchiveLink\" } \
        | { \
            type: \"Error\"; \
            id: number; \
            error: string; \
          }"
        .to_owned()
    }

    fn into_json_value(self) -> Value {
        jsonrpc_core::serde_json::to_value(self).unwrap() // todo: can we somehow get rid of that unwrap here?
    }

    crate::custom_return_type!("ChatListItemFetchResult_Type".to_owned());
}

pub(crate) async fn _get_chat_list_items_by_id(
    ctx: &deltachat::context::Context,
    entry: &ChatListEntry,
) -> Result<ChatListItemFetchResult> {
    let chat_id = ChatId::new(entry.0);
    let last_msgid = match entry.1 {
        0 => None,
        _ => Some(MsgId::new(entry.1)),
    };

    if chat_id.is_archived_link() {
        return Ok(ChatListItemFetchResult::ArchiveLink);
    }

    let chat = Chat::load_from_db(ctx, chat_id).await?;
    let summary = Chatlist::get_summary2(ctx, chat_id, last_msgid, Some(&chat)).await?;

    let summary_text1 = summary.prefix.map_or_else(String::new, |s| s.to_string());
    let summary_text2 = summary.text.to_owned();

    let visibility = chat.get_visibility();

    let avatar_path = chat
        .get_profile_image(ctx)
        .await?
        .map(|path| path.to_str().unwrap_or("invalid/path").to_owned());

    let last_updated = match last_msgid {
        Some(id) => {
            let last_message = deltachat::message::Message::load_from_db(ctx, id).await?;
            Some(last_message.get_timestamp() * 1000)
        }
        None => None,
    };

    let self_in_group = get_chat_contacts(ctx, chat_id)
        .await?
        .contains(&DC_CONTACT_ID_SELF);

    let fresh_message_counter = chat_id.get_fresh_msg_cnt(ctx).await?;
    let color = color_int_to_hex_string(chat.get_color(ctx).await?);

    Ok(ChatListItemFetchResult::ChatListItem {
        id: chat_id.to_u32(),
        name: chat.get_name().to_owned(),
        avatar_path,
        color,
        last_updated,
        summary_text1,
        summary_text2,
        summary_status: summary.state.to_u32().expect("impossible"), // idea and a function to transform the constant to strings? or return string enum
        is_protected: chat.is_protected(),
        is_group: chat.get_type() == Chattype::Group,
        fresh_message_counter,
        is_self_talk: chat.is_self_talk(),
        is_device_talk: chat.is_device_talk(),
        is_self_in_group: self_in_group,
        is_sending_location: chat.is_sending_locations(),
        is_archived: visibility == ChatVisibility::Archived,
        is_pinned: visibility == ChatVisibility::Pinned,
        is_muted: chat.is_muted(),
        is_contact_request: chat.is_contact_request(),
    })
}
